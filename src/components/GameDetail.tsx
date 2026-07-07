import React from 'react';
import { Game, ConsoleState } from '../types';
import RetroIcon from './RetroIcon';

interface GameDetailProps {
  game: Game;
  consoleState: ConsoleState;
  onBack: () => void;
  onBoot: () => void;
  onInsertDisc: () => void;
  onInstall: () => void;
  onCustomize: () => void;
  onDelete: () => void;
}

export const GameDetail: React.FC<GameDetailProps> = ({
  game,
  consoleState,
  onBack,
  onBoot,
  onInsertDisc,
  onInstall,
  onCustomize,
  onDelete,
}) => {
  const { insertedGameId, isSpinning, lidOpen } = consoleState;
  
  const isThisGameInserted = insertedGameId === game.id;

  // Determina lo stile di sfondo del disco per la demo 3D peek
  const getDiscStyles = (): React.CSSProperties => {
    const cust = game.customization;
    let background = '';

    switch (cust.discType) {
      case 'vinyl-black':
        background = `radial-gradient(circle, #333 4%, #111 8%, #222 15%, #111 25%, #222 35%, #111 45%, #222 55%, #111 65%, #222 75%, #111 85%, #000 100%)`;
        break;
      case 'classic-silver':
        background = `radial-gradient(circle, #e2e8f0 10%, #cbd5e1 30%, #94a3b8 50%, #cbd5e1 70%, #94a3b8 90%, #cbd5e1 100%)`;
        break;
      case 'retro-blue':
        background = `radial-gradient(circle, #3b82f6 10%, #1d4ed8 40%, #172554 80%, #0f172a 100%)`;
        break;
      case 'custom':
        background = `radial-gradient(circle, ${cust.discColor} 20%, #1a1a1a 80%, #000 100%)`;
        break;
    }

    return {
      background,
      border: `2px solid ${cust.discType === 'vinyl-black' ? '#222' : 'rgba(255,255,255,0.15)'}`,
    };
  };

  return (
    <div className="detail-container">
      {/* Intestazione con pulsante di ritorno */}
      <div className="back-btn-container">
        <button onClick={onBack}>
          <RetroIcon name="arrow-left" size={12} />
          <span>BIOS SCREEN</span>
        </button>
      </div>

      <div className="detail-layout">
        {/* Colonna Sinistra: 3D Visual Box + CD */}
        <div className="detail-visuals">
          <div className="visual-wrapper">
            {/* CD Sgusciante */}
            <div 
              className={`peek-disc`} 
              style={getDiscStyles()}
            >
              <div 
                className="disc-center-ring"
                style={{ borderColor: game.customization.discRingColor || 'rgba(255,255,255,0.15)' }}
              >
                <span style={{ color: game.customization.discTextColor || '#fff' }}>
                  {game.customization.customTitle || game.title}
                </span>
              </div>
            </div>

            {/* Custodia Jewel Case */}
            <div className={`detail-case style-${game.customization.coverStyle}`}>
              <div className="case-spine" />
              <img src={game.coverUrl} alt={game.title} className="case-cover-art" />
              <div className="case-glare" />
            </div>
          </div>
        </div>

        {/* Colonna Destra: Specifiche e Azioni di Boot */}
        <div className="detail-info">
          <h2 className="game-title text-mono">{game.title.toUpperCase()}</h2>

          {/* Dati tecnici del blocco semplificati */}
          <div className="specs-well">
            <div className="spec-item">
              <span className="spec-label">DEVELOPER</span>
              <span className="spec-value">{game.developer.toUpperCase()}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">RELEASE YEAR</span>
              <span className="spec-value">{game.releaseYear}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">GENRE</span>
              <span className="spec-value">{game.genre.toUpperCase()}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">PLAY TIME</span>
              <span className="spec-value">{game.playTime || '--'}</span>
            </div>
          </div>

          {/* Sezione delle azioni di boot */}
          <div className="main-actions-section">
            {!game.installed ? (
              // Stato non installato (Richiede copia in memoria)
              <button className="retro-btn btn-primary" onClick={onInstall} style={{ height: '44px' }}>
                <RetroIcon name="plus" size={14} />
                <span>COPY TO DRIVE</span>
              </button>
            ) : !isThisGameInserted ? (
              // Gioco installato ma CD non inserito nel lettore
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="status-alert-box">
                  <RetroIcon name="settings" className="alert-icon" size={18} />
                  <div className="alert-text">
                    NO DISC IN TRAY
                    <span>Open console lid and insert CD-ROM to play.</span>
                  </div>
                </div>
                <button 
                  className="retro-btn btn-primary" 
                  style={{ height: '44px' }}
                  onClick={onInsertDisc}
                >
                  <RetroIcon name="cd" size={14} />
                  <span>INSERT CD-ROM</span>
                </button>
              </div>
            ) : lidOpen ? (
              // Gioco inserito ma sportello aperto
              <div className="status-alert-box" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                <RetroIcon name="eject" className="alert-icon" color="#ef4444" size={18} />
                <div className="alert-text" style={{ color: '#ef4444' }}>
                  CD LID OPEN
                  <span style={{ color: '#ef4444' }}>Close console lid to start laser reading.</span>
                </div>
              </div>
            ) : (
              // Pronto all'avvio (CD inserito e coperchio chiuso)
              <button 
                className={`btn-boot-console ${isSpinning ? 'spinning-state' : 'ready-to-boot'}`}
                onClick={onBoot}
                disabled={isSpinning}
              >
                {isSpinning ? (
                  <>
                    <RetroIcon name="cd" className="spinner-icon" size={20} />
                    <span style={{ marginLeft: '8px' }}>READING DISC...</span>
                  </>
                ) : (
                  <>
                    <RetroIcon name="play" size={16} />
                    <span style={{ marginLeft: '8px' }}>BOOT DISC</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Azioni di Gestione */}
          <div className="management-actions">
            <button onClick={onCustomize}>
              <RetroIcon name="customize" size={12} />
              <span>CUSTOMIZE</span>
            </button>
            <button className="btn-delete" onClick={onDelete}>
              <RetroIcon name="trash" size={12} />
              <span>DELETE BLOCK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameDetail;
