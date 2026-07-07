import React, { useState } from 'react';
import { Game, SearchResultGame, SGDBAsset, TabType } from '../types';
import { searchGamesWithThumbnails, getAllGameAssets } from '../services/steamgriddb';
import RetroIcon from './RetroIcon';

interface AddGameWizardProps {
  onBack: () => void;
  onAddGame: (gameData: Omit<Game, 'id' | 'customization'> & {
    heroUrl?: string;
    logoUrl?: string;
    iconUrl?: string;
  }) => void;
  gamesCount: number;
}

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400';

export const AddGameWizard: React.FC<AddGameWizardProps> = ({
  onBack,
  onAddGame,
  gamesCount,
}) => {
  // Configurazione API Key
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      (import.meta.env.VITE_STEAMGRIDDB_API_KEY as string) ||
      localStorage.getItem('steamgriddb_api_key') ||
      ''
    );
  });
  const [tempKey, setTempKey] = useState<string>('');
  const [showKeySetup, setShowKeySetup] = useState<boolean>(!apiKey);

  // Stati del Wizard
  const [step, setStep] = useState<'search' | 'details'>('search');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exePath, setExePath] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResultGame[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dettagli del match selezionato
  const [selectedMatch, setSelectedMatch] = useState<SearchResultGame | null>(null);
  const [loadingAssets, setLoadingAssets] = useState<boolean>(false);

  // Gallerie asset caricati
  const [grids, setGrids] = useState<SGDBAsset[]>([]);
  const [heroes, setHeroes] = useState<SGDBAsset[]>([]);
  const [logos, setLogos] = useState<SGDBAsset[]>([]);
  const [icons, setIcons] = useState<SGDBAsset[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('grids');

  // Campi del form di aggiunta (Draft)
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftDeveloper, setDraftDeveloper] = useState<string>('');
  const [draftReleaseYear, setDraftReleaseYear] = useState<string>('');
  const [draftGenre, setDraftGenre] = useState<string>('');
  const [chosenCover, setChosenCover] = useState<string>(DEFAULT_COVER);
  const [chosenHero, setChosenHero] = useState<string>('');
  const [chosenLogo, setChosenLogo] = useState<string>('');
  const [chosenIcon, setChosenIcon] = useState<string>('');

  // Avvia ricerca automatica se c'è un testo inserito all'apertura
  const handleSaveKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem('steamgriddb_api_key', tempKey.trim());
      setApiKey(tempKey.trim());
      setShowKeySetup(false);
      setErrorMsg(null);
    }
  };

  const handleSearch = async (queryStr: string) => {
    if (!queryStr.trim()) return;
    setLoadingSearch(true);
    setErrorMsg(null);
    setSearchResults([]);

    try {
      const results = await searchGamesWithThumbnails(queryStr, apiKey);
      setSearchResults(results);
      if (results.length === 0) {
        setErrorMsg('NO MATCH FOUND IN STEAMGRIDDB DATABASE.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'ERRORE DURANTE LA RICERCA.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSelectMatch = async (match: SearchResultGame) => {
    setSelectedMatch(match);
    setDraftTitle(match.name);
    setDraftReleaseYear(match.releaseYear || '1998');
    setDraftDeveloper('');
    setDraftGenre('');
    setChosenCover(match.thumbnailUrl || DEFAULT_COVER);
    setChosenHero('');
    setChosenLogo('');
    setChosenIcon('');
    setStep('details');
    setLoadingAssets(true);

    try {
      const assets = await getAllGameAssets(match.id, apiKey);
      setGrids(assets.grids);
      setHeroes(assets.heroes);
      setLogos(assets.logos);
      setIcons(assets.icons);

      // Imposta le prime selezioni default se disponibili
      if (assets.grids.length > 0) setChosenCover(assets.grids[0].url);
      if (assets.heroes.length > 0) setChosenHero(assets.heroes[0].url);
      if (assets.logos.length > 0) setChosenLogo(assets.logos[0].url);
      if (assets.icons.length > 0) setChosenIcon(assets.icons[0].url);
    } catch (err) {
      // Ignora l'errore e procedi con i dati base recuperati
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleSkipSearch = () => {
    // Salta la ricerca e precompila un form manuale vuoto
    setSelectedMatch(null);
    setDraftTitle('');
    setDraftDeveloper('');
    setDraftReleaseYear('1998');
    setDraftGenre('RETRO CLASSIC');
    setChosenCover(DEFAULT_COVER);
    setChosenHero('');
    setChosenLogo('');
    setChosenIcon('');
    setGrids([]);
    setHeroes([]);
    setLogos([]);
    setIcons([]);
    setStep('details');
  };

  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;

    onAddGame({
      title: draftTitle.trim(),
      developer: draftDeveloper.trim() || 'UNKNOWN DEV',
      releaseYear: draftReleaseYear.trim() || '1998',
      genre: draftGenre.trim() || 'RETRO CLASSIC',
      coverUrl: chosenCover,
      heroUrl: chosenHero || undefined,
      logoUrl: chosenLogo || undefined,
      iconUrl: chosenIcon || undefined,
      installed: true, // Installato di default all'importazione
      path: exePath.trim() || undefined,
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
    <div className="add-game-wizard-container">
      {/* Intestazione */}
      <div className="wizard-header">
        <div className="title-area">
          <h2 className="header-title text-mono">IMPORT REGISTER STUDIO</h2>
          <span className="slot-indicator text-mono">SYSTEM CD SLOT #{gamesCount + 1}</span>
        </div>
        <button onClick={onBack} className="retro-btn">
          <RetroIcon name="arrow-left" size={10} />
          <span style={{ marginLeft: '6px' }}>BACK TO BIOS</span>
        </button>
      </div>

      {showKeySetup && step === 'search' ? (
        /* Setup chiave API se non presente */
        <div className="api-setup-view">
          <div className="setup-well">
            <RetroIcon name="settings" size={24} className="setup-icon" />
            <h3 className="text-mono">STEAMGRIDDB KEY REQUIRED</h3>
            <p>Configure a key to query grids, heroes, logos and icons automatically.</p>
            <p className="hint text-mono">Keys available at: https://www.steamgriddb.com/profile/api</p>

            <div className="input-group">
              <input
                type="password"
                placeholder="ENTER YOUR STEAMGRIDDB API KEY"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                className="text-mono"
              />
              <div className="btn-row">
                <button className="retro-btn" onClick={handleSkipSearch} style={{ border: 'none' }}>
                  SKIP (MANUAL ONLY)
                </button>
                <button className="retro-btn btn-success" onClick={handleSaveKey}>
                  SAVE KEY
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : step === 'search' ? (
        /* STEP 1: Ricerca gioco e lista match */
        <div className="search-layout">
          <div className="search-sidebar-well">
            <span className="panel-label">1. RETRIEVE GAME DATA</span>
            <div className="search-bar">
              <input
                type="text"
                placeholder="SEARCH DATABASE BY TITLE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-mono"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
              <button
                className="retro-btn btn-primary"
                onClick={() => handleSearch(searchQuery)}
                disabled={loadingSearch}
              >
                {loadingSearch ? 'SEARCHING...' : 'SEARCH'}
              </button>
            </div>
            
            <button className="retro-btn manual-btn" onClick={handleSkipSearch}>
              <RetroIcon name="plus" size={12} />
              <span>SKIP SEARCH (MANUAL IMPORT)</span>
            </button>
          </div>

          <div className="results-panel-well">
            <span className="panel-label">DATABASE MATCH RESULTS</span>
            
            {loadingSearch ? (
              <div className="loading-state">
                <span className="text-mono">FETCHING SEARCH RESULTS...</span>
              </div>
            ) : errorMsg ? (
              <div className="error-state text-mono">{errorMsg}</div>
            ) : searchResults.length === 0 ? (
              <div className="empty-state">
                <span className="text-mono">ENTER A QUERY TO SEARCH GIOCHI</span>
              </div>
            ) : (
              <div className="results-grid">
                {searchResults.map((match) => (
                  <div
                    key={match.id}
                    className="result-card"
                    onClick={() => handleSelectMatch(match)}
                  >
                    <div className="card-artwork">
                      {match.thumbnailUrl ? (
                        <img src={match.thumbnailUrl} alt={match.name} loading="lazy" />
                      ) : (
                        <div className="no-cover-placeholder">
                          <RetroIcon name="cd" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="card-info">
                      <span className="game-name text-mono">{match.name.toUpperCase()}</span>
                      {match.releaseYear && (
                        <span className="game-year text-mono">RELEASE: {match.releaseYear}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STEP 2: Precompilazione form e gallerie artwork */
        <form className="details-layout" onSubmit={handleSaveGame}>
          {/* Sezione Sinistra: Live Combined Preview */}
          <div className="left-preview-column">
            <span className="panel-label">LIVE INTEGRATION PREVIEW</span>
            <div className="preview-canvas-well">
              <div
                className="canvas-hero"
                style={{
                  backgroundImage: chosenHero ? `url(${chosenHero})` : 'none',
                }}
              >
                <div className="hero-gradient" />
                
                {/* Logo o Titolo */}
                <div className="canvas-logo-container">
                  {chosenLogo ? (
                    <img src={chosenLogo} alt="Logo preview" className="canvas-logo" />
                  ) : (
                    <h1 className="canvas-title text-mono">{(draftTitle || 'UNTITLED').toUpperCase()}</h1>
                  )}
                </div>

                {/* Copertina 3D fluttuante */}
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
            
            <button className="retro-btn btn-secondary-text" type="button" onClick={() => setStep('search')} style={{ marginTop: '10px' }}>
              <RetroIcon name="arrow-left" size={10} />
              <span style={{ marginLeft: '6px' }}>CHOOSE DIFFERENT GAME</span>
            </button>
          </div>

          {/* Sezione Destra: Form di Input e Gallerie */}
          <div className="right-form-column">
            <span className="panel-label">2. EDIT METADATA & CHOOSE ARTWORK</span>
            
            {/* Campi Metadati */}
            <div className="metadata-form-panel">
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="import-title">GAME TITLE</label>
                  <input
                    id="import-title"
                    type="text"
                    required
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="ENTER TITLE"
                    className="text-mono"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="import-dev">DEVELOPER</label>
                  <input
                    id="import-dev"
                    type="text"
                    value={draftDeveloper}
                    onChange={(e) => setDraftDeveloper(e.target.value)}
                    placeholder="ENTER DEVELOPER"
                    className="text-mono"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="import-year">RELEASE YEAR</label>
                  <input
                    id="import-year"
                    type="text"
                    value={draftReleaseYear}
                    onChange={(e) => setDraftReleaseYear(e.target.value)}
                    placeholder="1998"
                    className="text-mono"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="import-genre">GENRE</label>
                  <input
                    id="import-genre"
                    type="text"
                    value={draftGenre}
                    onChange={(e) => setDraftGenre(e.target.value)}
                    placeholder="ACTION ADVENTURE"
                    className="text-mono"
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="import-path">LOCAL EXECUTABLE PATH</label>
                <input
                  id="import-path"
                  type="text"
                  value={exePath}
                  onChange={(e) => setExePath(e.target.value)}
                  placeholder="C:/Program Files/Game/game.exe"
                  className="text-mono"
                />
              </div>
            </div>

            {/* Gallerie Selettori */}
            {selectedMatch && (
              <div className="galleries-well">
                <div className="tabs-row">
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'grids' ? 'active' : ''}`}
                    onClick={() => setActiveTab('grids')}
                  >
                    COVERS ({grids.length})
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'heroes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('heroes')}
                  >
                    HEROES ({heroes.length})
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'logos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('logos')}
                  >
                    LOGOS ({logos.length})
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'icons' ? 'active' : ''}`}
                    onClick={() => setActiveTab('icons')}
                  >
                    ICONS ({icons.length})
                  </button>
                </div>

                <div className="gallery-viewport">
                  {loadingAssets ? (
                    <div className="loading-spinner-box">
                      <span className="text-mono">LOADING ASSETS DATABASE...</span>
                    </div>
                  ) : (
                    renderActiveGallery()
                  )}
                </div>
              </div>
            )}

            {/* Salvataggio */}
            <div className="save-action-row">
              <button className="retro-btn btn-success" type="submit">
                <RetroIcon name="check" size={12} />
                <span style={{ marginLeft: '6px' }}>REGISTER CD DISC</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
export default AddGameWizard;
