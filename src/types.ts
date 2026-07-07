// Tipi per la personalizzazione del gioco (estetica retrò hardware)
export type CoverStyle = 'standard' | 'black-label' | 'platinum' | 'holographic';
export type DiscType = 'vinyl-black' | 'classic-silver' | 'retro-blue' | 'custom';
export type StickerStyle = 'none' | 'star' | 'demo' | 'retro-grid';

export interface GameCustomization {
  coverStyle: CoverStyle;
  discType: DiscType;
  discColor: string;          // Colore primario del corpo del disco
  discRingColor: string;      // Colore dell'anello interno del disco
  discTextColor: string;      // Colore dei testi stampati sul disco
  stickerStyle: StickerStyle; // Sticker aggiuntivi stampati sopra
  customTitle: string;        // Titolo personalizzato stampato sul disco
}

export interface Game {
  id: string;
  title: string;
  developer: string;
  releaseYear: string;
  genre: string;
  coverUrl: string;           // Immagine di copertina
  heroUrl?: string;           // Sfondo orizzontale
  logoUrl?: string;           // Logo trasparente overlay
  iconUrl?: string;           // Icona quadrata
  installed: boolean;
  lastPlayed?: string;        // Data dell'ultima partita (es. "05 MAG 1998" o "OGGI")
  playTime?: string;          // Tempo di gioco totale (es. "12h 30m")
  path?: string;              // Percorso dell'eseguibile mockato
  customization: GameCustomization;
}

// Stato principale della console / UI
export type ActiveView = 'library' | 'detail' | 'customize' | 'artwork' | 'add-game';
export type TabType = 'grids' | 'heroes' | 'logos' | 'icons';

export interface ConsoleState {
  powerOn: boolean;           // Stato di accensione della console (pulsante Power)
  lidOpen: boolean;           // Coperchio del lettore CD aperto/chiuso
  activeView: ActiveView;     // Schermata attiva
  selectedGameId: string | null; // ID del gioco correntemente selezionato
  insertedGameId: string | null; // ID del gioco correntemente inserito nel lettore CD
  isSpinning: boolean;        // Se il CD sta girando nel lettore (avvio gioco)
  isTransitioning: boolean;   // Stato di animazione durante l'inserimento
}

// Strutture dati per SteamGridDB API
export interface SGDBGameMatch {
  id: number;
  name: string;
  release_date?: string;
  types: string[];
}

export interface SGDBAsset {
  id: number;
  url: string;
  thumb: string;
  width: number;
  height: number;
  style: string;
  score: number;
}

export interface SearchResultGame {
  id: number;
  name: string;
  releaseYear?: string;
  thumbnailUrl: string | null;
}

export interface AddGameDraft {
  title: string;
  developer: string;
  releaseYear: string;
  genre: string;
  exePath: string;
  coverUrl: string;
  heroUrl: string;
  logoUrl: string;
  iconUrl: string;
  steamGridDbGameId?: number;
}


