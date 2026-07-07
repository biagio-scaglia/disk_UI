import { SGDBGameMatch, SGDBAsset, SearchResultGame } from '../types';

const BASE_URL = 'https://www.steamgriddb.com/api/v2';

function getHeaders(apiKey: string) {
  return {
    'Authorization': `Bearer ${apiKey}`,
  };
}

/**
 * Cerca un gioco su SteamGridDB tramite nome.
 */
export async function searchGames(query: string, apiKey: string): Promise<SGDBGameMatch[]> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('CHIAVE API MANCANTE. CONFIGURA LA CHIAVE NELLE IMPOSTAZIONI.');
  }

  try {
    const response = await fetch(`${BASE_URL}/search/autocomplete/game/${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: getHeaders(apiKey),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('CHIAVE API NON VALIDA. CONTROLLA LE CREDENZIALI.');
      }
      if (response.status === 429) {
        throw new Error('LIMITE DI RICHIESTE SGDB RAGGIUNTO. RIPROVA PIÙ TARDI.');
      }
      throw new Error(`ERRORE DI RETE: CODICE ${response.status}`);
    }

    const resJson = await response.json();
    if (resJson.success && Array.isArray(resJson.data)) {
      return resJson.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        release_date: item.release_date,
        types: item.types || []
      }));
    }
    return [];
  } catch (err: any) {
    throw new Error(err.message || 'ERRORE DI RETE DURANTE LA RICERCA.');
  }
}

/**
 * Recupera una tipologia specifica di asset per un gioco da SteamGridDB.
 */
export async function getGameAssets(
  gameId: number,
  category: 'grids' | 'heroes' | 'logos' | 'icons',
  apiKey: string
): Promise<SGDBAsset[]> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('CHIAVE API MANCANTE.');
  }

  // Costruiamo i filtri in base alla categoria per caricare gli asset migliori
  // E.g. per grids carichiamo preferibilmente quelle verticali 600x900 o 2:3
  let params = '';
  if (category === 'grids') {
    params = '?dimensions=600x900,460x215,920x430,460x215&styles=alternate,classic,blurred';
  } else if (category === 'heroes') {
    params = '?styles=alternate,material,blurred';
  } else if (category === 'logos') {
    params = '?styles=official,custom';
  } else if (category === 'icons') {
    params = '?styles=official,custom';
  }

  try {
    const response = await fetch(`${BASE_URL}/${category}/game/${gameId}${params}`, {
      method: 'GET',
      headers: getHeaders(apiKey),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('CHIAVE API NON VALIDA.');
      }
      return [];
    }

    const resJson = await response.json();
    if (resJson.success && Array.isArray(resJson.data)) {
      return resJson.data.map((item: any) => ({
        id: item.id,
        url: item.url,
        thumb: item.thumb || item.url,
        width: item.width || 0,
        height: item.height || 0,
        style: item.style || 'standard',
        score: item.score || 0
      }));
    }
    return [];
  } catch (err) {
    return [];
  }
}

export interface GroupedAssets {
  grids: SGDBAsset[];
  heroes: SGDBAsset[];
  logos: SGDBAsset[];
  icons: SGDBAsset[];
}

/**
 * Recupera in parallelo tutte le categorie di asset per un dato ID gioco.
 */
export async function getAllGameAssets(gameId: number, apiKey: string): Promise<GroupedAssets> {
  const [grids, heroes, logos, icons] = await Promise.all([
    getGameAssets(gameId, 'grids', apiKey),
    getGameAssets(gameId, 'heroes', apiKey),
    getGameAssets(gameId, 'logos', apiKey),
    getGameAssets(gameId, 'icons', apiKey),
  ]);

  return { grids, heroes, logos, icons };
}

/**
 * Cerca giochi su SteamGridDB e carica in parallelo una copertina di anteprima per ciascun risultato.
 */
export async function searchGamesWithThumbnails(query: string, apiKey: string): Promise<SearchResultGame[]> {
  const matches = await searchGames(query, apiKey);
  // Limita a 5 risultati per non saturare la quota API in un colpo solo
  const topMatches = matches.slice(0, 5);

  return Promise.all(
    topMatches.map(async (match) => {
      try {
        const grids = await getGameAssets(match.id, 'grids', apiKey);
        const thumbnailUrl = grids.length > 0 ? grids[0].thumb : null;
        const releaseYear = match.release_date ? match.release_date.split('-')[0] : undefined;
        return {
          id: match.id,
          name: match.name,
          releaseYear,
          thumbnailUrl,
        };
      } catch (e) {
        return {
          id: match.id,
          name: match.name,
          releaseYear: match.release_date ? match.release_date.split('-')[0] : undefined,
          thumbnailUrl: null,
        };
      }
    })
  );
}

