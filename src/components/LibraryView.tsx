import React, { useState } from 'react';
import { Game } from '../types';
import RetroIcon from './RetroIcon';

interface LibraryViewProps {
  games: Game[];
  onSelectGame: (gameId: string) => void;
  onAddGame: (gameData: Omit<Game, 'id' | 'customization'>) => void;
  onLoadMockData: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  games,
  onSelectGame,
  onAddGame,
  onLoadMockData,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [developer, setDeveloper] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [genre, setGenre] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [installed, setInstalled] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    // Se non viene inserito l'URL della cover, usiamo un placeholder generico generato in locale o tinta unita
    const finalCoverUrl = coverUrl || `https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400`;

    onAddGame({
      title,
      developer: developer || 'UNKNOWN DEV',
      releaseYear: releaseYear || '1998',
      genre: genre || 'RETRO CLASSIC',
      coverUrl: finalCoverUrl,
      installed,
    });

    // Reset Form
    setTitle('');
    setDeveloper('');
    setReleaseYear('');
    setGenre('');
    setCoverUrl('');
    setInstalled(true);
    setShowModal(false);
  };

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
              <button onClick={() => setShowModal(true)}>
                ADD NEW CD
              </button>
            </div>
          </div>
        </div>

        {/* Modal di aggiunta gioco */}
        {showModal && renderAddGameModal()}
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
          <button className="retro-btn" onClick={() => setShowModal(true)}>
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
        <div className="add-game-card" onClick={() => setShowModal(true)} title="Registra nuovo disco">
          <RetroIcon name="plus" size={24} />
          <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>[ADD]</span>
        </div>
      </div>

      {/* Modal di aggiunta gioco */}
      {showModal && renderAddGameModal()}
    </div>
  );

  // Helper per renderizzare il modal del BIOS
  function renderAddGameModal() {
    return (
      <div className="add-game-modal-overlay">
        <form className="add-game-modal" onSubmit={handleSubmit}>
          <div className="modal-header">
            <span>INSERIMENTO NUOVO CD</span>
            <span style={{ color: '#7e8394' }}>SLOT {games.length + 1}</span>
          </div>

          <div className="form-group">
            <label htmlFor="input-title">Titolo Gioco</label>
            <input
              id="input-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es. RESIDENT EVIL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="input-dev">Sviluppatore</label>
            <input
              id="input-dev"
              type="text"
              value={developer}
              onChange={(e) => setDeveloper(e.target.value)}
              placeholder="Es. CAPCOM"
            />
          </div>

          <div className="form-group">
            <label htmlFor="input-year">Anno Uscita</label>
            <input
              id="input-year"
              type="text"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="Es. 1996"
            />
          </div>

          <div className="form-group">
            <label htmlFor="input-genre">Genere</label>
            <input
              id="input-genre"
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Es. SURVIVAL HORROR"
            />
          </div>

          <div className="form-group">
            <label htmlFor="input-cover">URL Immagine Copertina</label>
            <input
              id="input-cover"
              type="text"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="URL Copertina o lascia vuoto"
            />
          </div>

          <div className="form-group">
            <label htmlFor="select-installed">Stato Installazione</label>
            <select
              id="select-installed"
              value={installed ? 'true' : 'false'}
              onChange={(e) => setInstalled(e.target.value === 'true')}
            >
              <option value="true">INSTALLATO (PRONTO)</option>
              <option value="false">NON INSTALLATO</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
              ANNULLA
            </button>
            <button type="submit" className="retro-btn btn-success">
              REGISTRA DISCO
            </button>
          </div>
        </form>
      </div>
    );
  }
};
export default LibraryView;
