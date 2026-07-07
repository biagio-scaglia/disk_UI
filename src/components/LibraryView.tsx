import React from 'react';
import { Game } from '../types';
import RetroIcon from './RetroIcon';

interface LibraryViewProps {
  games: Game[];
  onSelectGame: (gameId: string) => void;
  onAddGameClick: () => void;
  onLoadMockData: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  games,
  onSelectGame,
  onAddGameClick,
  onLoadMockData,
}) => {

  // Se la libreria è vuota, mostriamo il BIOS Empty State
  if (games.length === 0) {
    return (
      <div className="library-container">
        <div className="empty-library-state">
          <div className="bios-screen">
            <div className="bios-header">
              <span>BIOS v1.00</span>
              <span>MEMORY STATE: 0/8 BLOCKS</span>
            </div>
            
            <h2 className="bios-title">INSERT DISC TO INITIATE SYSTEM</h2>
            
            <p className="bios-instruction">
              Nessun blocco di salvataggio rilevato in memoria. Inserisci un nuovo supporto o carica i dati predefiniti della console.
            </p>

            {/* Visualizzatore slot Memory Card (Tutti vuoti) */}
            <div className="memory-blocks-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="memory-block">
                  <RetroIcon name="memory-card" size={14} />
                  <span>SLOT #{i + 1}</span>
                </div>
              ))}
            </div>

            <div className="bios-actions">
              <button 
                onClick={onLoadMockData}
                style={{ marginRight: '10px' }}
              >
                LOAD PRESETS
              </button>
              <button onClick={onAddGameClick}>
                ADD NEW CD
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout Libreria con giochi
  return (
    <div className="library-container">
      <div className="library-header">
        <div className="library-title text-mono">
          <RetroIcon name="controller" size={18} />
          <span>LIBRERIA — {games.length} BLOCKS</span>
        </div>
        <div className="header-actions">
          <button className="retro-btn" onClick={onAddGameClick}>
            <RetroIcon name="plus" size={12} />
            <span>ADD CD</span>
          </button>
        </div>
      </div>

      <div className="library-grid">
        {games.map((game) => {
          // Assegna la classe CSS basata sullo stile copertina
          let caseStyleClass = '';
          if (game.customization.coverStyle === 'black-label') caseStyleClass = 'style-black-label';
          if (game.customization.coverStyle === 'platinum') caseStyleClass = 'style-platinum';
          if (game.customization.coverStyle === 'holographic') caseStyleClass = 'style-holographic';

          return (
            <div
              key={game.id}
              className={`jewel-case ${caseStyleClass}`}
              onClick={() => onSelectGame(game.id)}
              title={game.title}
            >
              {/* Costola rigata */}
              <div className="case-spine" />
              
              {/* Copertina del gioco (Badge rimosso per pulizia visiva) */}
              <div className="case-artwork-wrapper">
                <img src={game.coverUrl} alt={game.title} className="cover-image" />
              </div>

              {/* Riflesso plastica */}
              <div className="case-glare" />
            </div>
          );
        })}

        {/* Bottone rapido aggiunta nella griglia */}
        <div className="add-game-card" onClick={onAddGameClick} title="Registra nuovo disco">
          <RetroIcon name="plus" size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>[ADD]</span>
        </div>
      </div>
    </div>
  );
};
export default LibraryView;
