import React, { useState, useEffect } from 'react';
import { Game, SGDBGameMatch, SGDBAsset } from '../types';
import { searchGames, getAllGameAssets } from '../services/steamgriddb';
import RetroIcon from './RetroIcon';

interface ArtworkManagerProps {
  game: Game;
  onBack: () => void;
  onSaveArtwork: (
    gameId: string,
    artwork: {
      coverUrl: string;
      heroUrl?: string;
      logoUrl?: string;
      iconUrl?: string;
    }
  ) => void;
}

type TabType = 'grids' | 'heroes' | 'logos' | 'icons';

export const ArtworkManager: React.FC<ArtworkManagerProps> = ({
  game,
  onBack,
  onSaveArtwork,
}) => {
  // Gestione API Key
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('steamgriddb_api_key') || '';
  });
  const [tempKey, setTempKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(!apiKey);

  // Stati di ricerca
  const [searchQuery, setSearchQuery] = useState<string>(game.title);
  const [matches, setMatches] = useState<SGDBGameMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<SGDBGameMatch | null>(null);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Stati galleria asset
  const [loadingAssets, setLoadingAssets] = useState<boolean>(false);
  const [grids, setGrids] = useState<SGDBAsset[]>([]);
  const [heroes, setHeroes] = useState<SGDBAsset[]>([]);
  const [logos, setLogos] = useState<SGDBAsset[]>([]);
  const [icons, setIcons] = useState<SGDBAsset[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('grids');

  // Asset selezionati per il salvataggio
  const [chosenCover, setChosenCover] = useState<string>(game.coverUrl);
  const [chosenHero, setChosenHero] = useState<string>(game.heroUrl || '');
  const [chosenLogo, setChosenLogo] = useState<string>(game.logoUrl || '');
  const [chosenIcon, setChosenIcon] = useState<string>(game.iconUrl || '');

  // Ricerca automatica all'avvio se la chiave è presente
  useEffect(() => {
    if (apiKey) {
      handleSearch(game.title, apiKey);
    }
  }, [apiKey]);

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem('steamgriddb_api_key', tempKey.trim());
      setApiKey(tempKey.trim());
      setShowKeyInput(false);
      setErrorMsg(null);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('steamgriddb_api_key');
    setApiKey('');
    setShowKeyInput(true);
    setMatches([]);
    setSelectedMatch(null);
    clearAssets();
  };

  const clearAssets = () => {
    setGrids([]);
    setHeroes([]);
    setLogos([]);
    setIcons([]);
  };

  const handleSearch = async (queryStr: string, keyStr: string) => {
    if (!queryStr.trim() || !keyStr) return;
    setLoadingMatches(true);
    setErrorMsg(null);
    setSelectedMatch(null);
    clearAssets();

    try {
      const results = await searchGames(queryStr, keyStr);
      setMatches(results);
      if (results.length === 0) {
        setErrorMsg('NO MATCH FOUND FOR THIS SEARCH QUERY.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'ERRORE DURANTE LA RICERCA.');
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleSelectGameMatch = async (match: SGDBGameMatch) => {
    setSelectedMatch(match);
    setLoadingAssets(true);
    setErrorMsg(null);
    clearAssets();

    try {
      const assets = await getAllGameAssets(match.id, apiKey);
      setGrids(assets.grids);
      setHeroes(assets.heroes);
      setLogos(assets.logos);
      setIcons(assets.icons);

      // Pre-seleziona la prima disponibile per ogni categoria se l'utente non ha impostato nulla
      if (assets.grids.length > 0) setChosenCover(assets.grids[0].url);
      if (assets.heroes.length > 0) setChosenHero(assets.heroes[0].url);
      if (assets.logos.length > 0) setChosenLogo(assets.logos[0].url);
      if (assets.icons.length > 0) setChosenIcon(assets.icons[0].url);
    } catch (err: any) {
      setErrorMsg('ERRORE DURANTE IL CARICAMENTO DEGLI ARTWORK.');
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleApplyArtwork = () => {
    onSaveArtwork(game.id, {
      coverUrl: chosenCover,
      heroUrl: chosenHero || undefined,
      logoUrl: chosenLogo || undefined,
      iconUrl: chosenIcon || undefined,
    });
    onBack();
  };

  const renderActiveGallery = () => {
    let list: SGDBAsset[] = [];
    let chosenVal = '';
    let setChosenFn: (url: string) => void = () => {};
    let itemAspectRatio = '1/1';
    let containerClass = 'gallery-grid-standard';

    switch (activeTab) {
      case 'grids':
        list = grids;
        chosenVal = chosenCover;
        setChosenFn = setChosenCover;
        itemAspectRatio = '2/3';
        containerClass = 'gallery-grid-covers';
        break;
      case 'heroes':
        list = heroes;
        chosenVal = chosenHero;
        setChosenFn = setChosenHero;
        itemAspectRatio = '16/9';
        containerClass = 'gallery-grid-heroes';
        break;
      case 'logos':
        list = logos;
        chosenVal = chosenLogo;
        setChosenFn = setChosenLogo;
        itemAspectRatio = '16/7';
        containerClass = 'gallery-grid-logos';
        break;
      case 'icons':
        list = icons;
        chosenVal = chosenIcon;
        setChosenFn = setChosenIcon;
        itemAspectRatio = '1/1';
        containerClass = 'gallery-grid-icons';
        break;
    }

    if (list.length === 0) {
      return (
        <div className="gallery-empty-state">
          <span className="text-mono">NO ASSETS FOUND IN THIS CATEGORY</span>
        </div>
      );
    }

    return (
      <div className={containerClass}>
        {list.map((asset) => {
          const isSelected = chosenVal === asset.url;
          return (
            <div
              key={asset.id}
              className={`asset-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setChosenFn(asset.url)}
              style={{ aspectRatio: itemAspectRatio }}
            >
              <img src={asset.thumb} alt={`${activeTab} option`} loading="lazy" />
              {isSelected && (
                <div className="selection-badge">
                  <RetroIcon name="check" size={10} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="artwork-manager-container">
      {/* Header */}
      <div className="manager-header">
        <div className="title-area">
          <h2 className="header-title text-mono">STEAMGRIDDB INTEGRATION</h2>
          <span className="game-target-text text-mono">TARGET: {game.title.toUpperCase()}</span>
        </div>
        <div className="header-actions">
          {apiKey && (
            <button className="retro-btn btn-danger-text" onClick={handleClearKey} style={{ marginRight: '12px', fontSize: '0.65rem' }}>
              CLEAR API KEY
            </button>
          )}
          <button onClick={onBack} className="retro-btn">
            <RetroIcon name="arrow-left" size={10} />
            <span style={{ marginLeft: '6px' }}>BACK</span>
          </button>
        </div>
      </div>

      {showKeyInput ? (
        /* Schermata configurazione API Key */
        <div className="api-key-setup-card">
          <div className="setup-well">
            <RetroIcon name="settings" size={24} className="setup-icon" />
            <h3 className="text-mono">API KEY REQUIRED</h3>
            <p>To pull artwork from SteamGridDB, you need a personal API key.</p>
            <p className="hint text-mono">Get yours at: https://www.steamgriddb.com/profile/api</p>

            <div className="input-group">
              <input
                type="password"
                placeholder="ENTER YOUR STEAMGRIDDB API KEY"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="text-mono"
              />
              <button className="retro-btn btn-success" onClick={handleSaveKey}>
                SAVE KEY
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Schermata principale del Manager */
        <div className="manager-layout">
          {/* Sezione Sinistra: Ricerca e Risultati dei Giochi */}
          <div className="search-section-wrapper">
            <div className="control-panel">
              <span className="panel-label">1. DATABASE SEARCH</span>
              <div className="search-bar">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="SEARCH GAME TITLE..."
                  className="text-mono"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery, apiKey)}
                />
                <button
                  className="retro-btn btn-primary"
                  onClick={() => handleSearch(searchQuery, apiKey)}
                  disabled={loadingMatches}
                >
                  {loadingMatches ? 'SEARCHING...' : 'SEARCH'}
                </button>
              </div>
            </div>

            {/* Risultati dei match */}
            <div className="matches-list-well">
              <span className="panel-label">MATCH RESULTS</span>
              {loadingMatches ? (
                <div className="loading-spinner-box">
                  <span className="text-mono">QUERYING STEAMGRIDDB DATABASE...</span>
                </div>
              ) : errorMsg ? (
                <div className="error-message-well text-mono">
                  {errorMsg}
                </div>
              ) : matches.length === 0 ? (
                <div className="matches-empty-state">
                  <span className="text-mono">SUBMIT A SEARCH QUERY TO FIND DATABASE MATCHES</span>
                </div>
              ) : (
                <div className="matches-grid">
                  {matches.map((match) => {
                    const isSelected = selectedMatch?.id === match.id;
                    return (
                      <div
                        key={match.id}
                        className={`match-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectGameMatch(match)}
                      >
                        <div className="match-info">
                          <span className="match-name text-mono">{match.name.toUpperCase()}</span>
                          {match.release_date && (
                            <span className="match-date text-mono">({match.release_date.split('-')[0]})</span>
                          )}
                        </div>
                        <div className="match-id text-mono">ID: {match.id}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sezione Destra: Galleria e Anteprima in tempo reale */}
          <div className="gallery-section-wrapper">
            {selectedMatch ? (
              <>
                <div className="gallery-control-panel">
                  <span className="panel-label">2. SELECT ARTWORK ASSETS</span>
                  {/* Tabs di navigazione per le tipologie di asset */}
                  <div className="tabs-row">
                    <button
                      className={`tab-btn ${activeTab === 'grids' ? 'active' : ''}`}
                      onClick={() => setActiveTab('grids')}
                    >
                      COVERS ({grids.length})
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'heroes' ? 'active' : ''}`}
                      onClick={() => setActiveTab('heroes')}
                    >
                      HEROES ({heroes.length})
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'logos' ? 'active' : ''}`}
                      onClick={() => setActiveTab('logos')}
                    >
                      LOGOS ({logos.length})
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'icons' ? 'active' : ''}`}
                      onClick={() => setActiveTab('icons')}
                    >
                      ICONS ({icons.length})
                    </button>
                  </div>
                </div>

                <div className="gallery-viewport">
                  {loadingAssets ? (
                    <div className="loading-spinner-box">
                      <span className="text-mono">FETCHING IMAGES FROM DATABASE...</span>
                    </div>
                  ) : (
                    renderActiveGallery()
                  )}
                </div>

                {/* Anteprima combinata e Salvataggio */}
                <div className="combined-preview-section">
                  <span className="panel-label">LIVE INTEGRATION PREVIEW</span>
                  <div className="preview-canvas-well">
                    {/* Sfondo Hero */}
                    <div
                      className="canvas-hero"
                      style={{
                        backgroundImage: chosenHero ? `url(${chosenHero})` : 'none',
                      }}
                    >
                      <div className="hero-gradient" />
                      
                      {/* Logo trasparente o Titolo */}
                      <div className="canvas-logo-container">
                        {chosenLogo ? (
                          <img src={chosenLogo} alt="Logo preview" className="canvas-logo" />
                        ) : (
                          <h1 className="canvas-title text-mono">{game.title.toUpperCase()}</h1>
                        )}
                      </div>

                      {/* Cover 3D fluttuante */}
                      <div className="canvas-jewel-case">
                        <div className="case-spine" />
                        {chosenCover ? (
                          <img src={chosenCover} alt="Cover preview" className="case-cover-art" />
                        ) : (
                          <div className="empty-cover-placeholder" />
                        )}
                        <div className="case-glare" />
                      </div>
                    </div>
                  </div>

                  <div className="action-row">
                    <button className="retro-btn btn-success" onClick={handleApplyArtwork}>
                      <RetroIcon name="check" size={12} />
                      <span style={{ marginLeft: '6px' }}>APPLY ARTWORK PACK</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="gallery-locked-state">
                <RetroIcon name="settings" size={32} className="lock-icon" />
                <span className="text-mono">SELECT A MATCHED GAME TO BROWSE AVAILABLE ARTWORK</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ArtworkManager;
