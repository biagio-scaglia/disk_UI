import React from 'react';
import { ConsoleState, Game } from '../types';
import RetroIcon from './RetroIcon';

interface DiscTrayProps {
  consoleState: ConsoleState;
  insertedGame: Game | null;
  onInsertDisc: () => void;
}

export const DiscTray: React.FC<DiscTrayProps> = ({
  consoleState,
  insertedGame,
  onInsertDisc,
}) => {
  const { powerOn, lidOpen, isSpinning, isTransitioning } = consoleState;

  // Determina lo stile di sfondo del disco basato sul tipo e colore personalizzato
  const getDiscStyles = (game: Game): React.CSSProperties => {
    const cust = game.customization;
    let background = '';

    switch (cust.discType) {
      case 'vinyl-black':
        // Stile vinile nero con scanalature concentriche
        background = `radial-gradient(circle, #333 2%, #111 4%, #222 8%, #111 12%, #222 16%, #111 20%, #222 24%, #111 28%, #222 32%, #111 36%, #222 40%, #111 44%, #222 48%, #111 52%, #222 56%, #111 60%, #222 64%, #111 68%, #222 72%, #111 76%, #222 80%, #111 85%, #222 90%, #111 95%, #000 100%)`;
        break;
      case 'classic-silver':
        background = `radial-gradient(circle, #e2e8f0 10%, #cbd5e1 30%, #94a3b8 50%, #cbd5e1 70%, #94a3b8 90%, #cbd5e1 100%)`;
        break;
      case 'retro-blue':
        background = `radial-gradient(circle, #3b82f6 10%, #1d4ed8 40%, #172554 80%, #0f172a 100%)`;
        break;
      case 'custom':
        // Colore custom con leggero gradiente di riflesso
        const primary = cust.discColor || '#7c3aed';
        background = `radial-gradient(circle, ${primary} 20%, ${darkenColor(primary, 30)} 80%, ${darkenColor(primary, 50)} 100%)`;
        break;
    }

    return {
      background,
      border: `2px solid ${cust.discType === 'vinyl-black' ? '#222' : 'rgba(255,255,255,0.1)'}`,
    };
  };

  // Helper semplice per scurire un colore hex (mock per anteprima)
  function darkenColor(hex: string, percent: number): string {
    let num = parseInt(hex.replace("#",""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = (num >> 8 & 0x00FF) - amt,
    B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R<0?0:R>255?255:R)*0x10000 + (G<0?0:G>255?255:G)*0x100 + (B<0?0:B>255?255:B)).toString(16).slice(1);
  }

  return (
    <div className="disc-tray-system">
      <div className="tray-header">
        <span className="tray-title">DISC PLAYBACK SYSTEM</span>
        <span className={`tray-status ${lidOpen ? 'open' : insertedGame ? 'closed' : 'empty'}`}>
          {lidOpen ? 'LID OPEN' : insertedGame ? 'DISC LOADED' : 'NO DISC'}
        </span>
      </div>

      <div className="disc-bay-well">
        {/* Gruppo Meccanico Laser */}
        <div className="laser-assembly">
          <div className="laser-track">
            <div className={`laser-lens ${powerOn && isSpinning ? 'active' : ''}`} />
          </div>
        </div>

        {/* Perno Centrale (Spindle) */}
        <div className="spindle-hub">
          <div className="spindle-center" />
        </div>

        {/* CD Fisico - Visibile solo se inserito ed è aperto lo sportello,
            o se chiuso ma mostriamo trasparenza. In questo concept,
            lo mostriamo sempre se inserito e sportello aperto. */}
        {insertedGame && (
          <div
            className={`disc-media ${isSpinning ? 'spinning' : ''} ${
              isTransitioning ? 'insert-animation' : ''
            }`}
            style={getDiscStyles(insertedGame)}
          >
            {/* Anello interno del CD */}
            <div 
              className="disc-inner-ring"
              style={{ borderColor: insertedGame.customization.discRingColor || 'rgba(255,255,255,0.2)' }}
            >
              {/* Monospace label print stampata sul disco */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.45rem',
                  fontFamily: '"Share Tech Mono", monospace',
                  color: insertedGame.customization.discTextColor || '#fff',
                  textTransform: 'uppercase',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ transform: 'rotate(-45deg)', textAlign: 'center', maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {insertedGame.customization.customTitle || insertedGame.title}
                </div>
              </div>
            </div>

            {/* Sticker aggiuntivi stampati sopra il CD */}
            {insertedGame.customization.stickerStyle === 'demo' && (
              <div style={{
                position: 'absolute',
                top: '25px',
                left: '25px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.5rem',
                fontFamily: '"Share Tech Mono", monospace',
                padding: '2px 4px',
                transform: 'rotate(-15deg)',
                border: '1px solid #fff',
                fontWeight: 'bold',
                boxShadow: '1px 1px 2px rgba(0,0,0,0.5)'
              }}>
                DEMO ONLY
              </div>
            )}
            {insertedGame.customization.stickerStyle === 'star' && (
              <div style={{
                position: 'absolute',
                bottom: '30px',
                right: '30px',
                color: '#f59e0b',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))',
                transform: 'rotate(20deg)'
              }}>
                <RetroIcon name="star" size={20} />
              </div>
            )}
            {insertedGame.customization.stickerStyle === 'retro-grid' && (
              <div style={{
                position: 'absolute',
                bottom: '25px',
                left: '25px',
                border: '1px solid rgba(0,240,255,0.4)',
                width: '30px',
                height: '15px',
                background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,240,255,0.1) 2px, rgba(0,240,255,0.1) 4px)',
                transform: 'rotate(10deg)'
              }} />
            )}
          </div>
        )}

        {/* Coperchio Fisico della Console */}
        <div className={`lid-cover-overlay ${lidOpen ? 'open' : ''}`}>
          <div className="lid-imprint">
            <RetroIcon name="cd" size={40} className="imprint-icon" />
            <div className="imprint-text">COMPACT DISC</div>
            <div className="imprint-text" style={{ fontSize: '0.45rem', marginTop: '2px' }}>DRIVE TR-01</div>
          </div>
        </div>
      </div>

      {/* Info Panel inferiore */}
      {lidOpen ? (
        <button
          className="disc-tray-footer retro-btn btn-primary"
          style={{ width: '100%', height: '32px', padding: 0 }}
          disabled={!powerOn || !!insertedGame}
          onClick={onInsertDisc}
        >
          {insertedGame ? 'CD GIÀ INSERITO' : 'INSERISCI DISCO'}
        </button>
      ) : (
        <div className={`disc-tray-footer ${insertedGame ? 'has-disc' : ''}`}>
          {insertedGame ? (
            <span className="text-mono">{insertedGame.title.toUpperCase()}</span>
          ) : (
            <span className="text-mono">VANO DISCO VUOTO</span>
          )}
        </div>
      )}
    </div>
  );
};
export default DiscTray;
