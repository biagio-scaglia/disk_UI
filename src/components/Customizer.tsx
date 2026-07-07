import React, { useState } from 'react';
import { Game, GameCustomization, CoverStyle, DiscType, StickerStyle } from '../types';
import RetroIcon from './RetroIcon';

interface CustomizerProps {
  game: Game;
  onSave: (customization: GameCustomization) => void;
  onCancel: () => void;
}

// Colori Retro Console Hardware Consigliati per le stampe custom
const SWATCHES = [
  { name: 'Sony Grey', value: '#a0a4ab' },
  { name: 'Sega Blue', value: '#1e40af' },
  { name: 'Console Black', value: '#1f2937' },
  { name: 'Toxic Green', value: '#10b981' },
  { name: 'Cyberpunk Cyan', value: '#06b6d4' },
  { name: 'Acid Yellow', value: '#eab308' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Retro Violet', value: '#7c3aed' },
  { name: 'Biohazard Orange', value: '#ea580c' },
  { name: 'Vintage Cream', value: '#e2dcd0' },
];

export const Customizer: React.FC<CustomizerProps> = ({
  game,
  onSave,
  onCancel,
}) => {
  const [coverStyle, setCoverStyle] = useState<CoverStyle>(game.customization.coverStyle);
  const [discType, setDiscType] = useState<DiscType>(game.customization.discType);
  const [discColor, setDiscColor] = useState(game.customization.discColor);
  const [discRingColor, setDiscRingColor] = useState(game.customization.discRingColor);
  const [discTextColor, setDiscTextColor] = useState(game.customization.discTextColor);
  const [stickerStyle, setStickerStyle] = useState<StickerStyle>(game.customization.stickerStyle);
  const [customTitle, setCustomTitle] = useState(game.customization.customTitle);

  const handleSave = () => {
    onSave({
      coverStyle,
      discType,
      discColor,
      discRingColor,
      discTextColor,
      stickerStyle,
      customTitle: customTitle || game.title,
    });
  };

  // Helper per calcolare lo stile del disco dell'anteprima in tempo reale
  const getPreviewDiscStyles = (): React.CSSProperties => {
    let background = '';

    switch (discType) {
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
        background = `radial-gradient(circle, ${discColor} 20%, ${darkenColor(discColor, 30)} 80%, ${darkenColor(discColor, 50)} 100%)`;
        break;
    }

    return {
      background,
      border: `2px solid ${discType === 'vinyl-black' ? '#222' : 'rgba(255,255,255,0.15)'}`,
    };
  };

  function darkenColor(hex: string, percent: number): string {
    let num = parseInt(hex.replace("#",""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) - amt,
    G = (num >> 8 & 0x00FF) - amt,
    B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R<0?0:R>255?255:R)*0x10000 + (G<0?0:G>255?255:G)*0x100 + (B<0?0:B>255?255:B)).toString(16).slice(1);
  }

  return (
    <div className="customizer-container">
      {/* Intestazione */}
      <div className="customizer-header">
        <h2 className="header-title text-mono">STAMPA & CONFEZIONAMENTO HARDWARE</h2>
        <button onClick={onCancel} style={{ padding: '6px 12px', fontSize: '0.75rem' }} className="retro-btn">
          <RetroIcon name="arrow-left" size={12} />
          <span style={{ marginLeft: '6px' }}>INDIETRO</span>
        </button>
      </div>

      <div className="customizer-layout">
        {/* Colonna Sinistra: Live Preview */}
        <div className="preview-section">
          <span className="preview-label">Anteprima di Produzione</span>
          <div className="preview-display">
            {/* Jewel Case Preview */}
            <div className={`preview-case style-${coverStyle}`}>
              <div className="case-spine" />
              <img src={game.coverUrl} alt={game.title} className="cover-img" />
              <div className="case-glare" />
            </div>

            {/* CD Preview */}
            <div className="preview-disc" style={getPreviewDiscStyles()}>
              <div className="disc-center-ring" style={{ borderColor: discRingColor }}>
                <span style={{ color: discTextColor }}>
                  {customTitle || game.title}
                </span>
              </div>
              
              {/* Sticker di anteprima */}
              {stickerStyle === 'demo' && (
                <div style={{
                  position: 'absolute', top: '18px', left: '18px', background: '#ef4444',
                  color: '#fff', fontSize: '0.4rem', fontFamily: '"Share Tech Mono", monospace',
                  padding: '1px 3px', transform: 'rotate(-15deg)', border: '1px solid #fff',
                  fontWeight: 'bold', boxShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                }}>
                  DEMO ONLY
                </div>
              )}
              {stickerStyle === 'star' && (
                <div style={{
                  position: 'absolute', bottom: '24px', right: '24px', color: '#f59e0b',
                  filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))', transform: 'rotate(20deg)'
                }}>
                  <RetroIcon name="star" size={16} />
                </div>
              )}
              {stickerStyle === 'retro-grid' && (
                <div style={{
                  position: 'absolute', bottom: '20px', left: '20px', border: '1px solid rgba(0,240,255,0.4)',
                  width: '24px', height: '12px',
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,240,255,0.1) 2px, rgba(0,240,255,0.1) 4px)',
                  transform: 'rotate(10deg)'
                }} />
              )}
            </div>
          </div>
          <span className="text-mono" style={{ fontSize: '0.6rem', color: '#7e8394', textAlign: 'center' }}>
            REGISTRO FISICO: {game.title.toUpperCase()}
          </span>
        </div>

        {/* Colonna Destra: Opzioni */}
        <div className="options-section">
          {/* Box Custodia */}
          <div className="options-group">
            <span className="group-title">1. Edizione Custodia (Jewel Case)</span>
            
            <div className="option-field">
              <label htmlFor="select-cover">Materiale / Stile Copertina</label>
              <select
                id="select-cover"
                value={coverStyle}
                onChange={(e) => setCoverStyle(e.target.value as CoverStyle)}
              >
                <option value="standard">STANDARD (PLASTICA TRASPARENTE)</option>
                <option value="black-label">BLACK LABEL (VERSIONE RETRO CLASSIC)</option>
                <option value="platinum">PLATINUM RANGE (BEST SELLER)</option>
                <option value="holographic">HOLOGRAPHIC (RIFLESSO CANGIANTE)</option>
              </select>
            </div>
          </div>

          {/* Box Disco CD */}
          <div className="options-group">
            <span className="group-title">2. Finitura Supporto Fisico (CD-ROM)</span>
            
            <div className="option-field">
              <label htmlFor="select-disc-type">Stile Superficie CD</label>
              <select
                id="select-disc-type"
                value={discType}
                onChange={(e) => setDiscType(e.target.value as DiscType)}
              >
                <option value="vinyl-black">VINILE NERO OPACIZZATO</option>
                <option value="classic-silver">SILVER METAL (STILE CD AUDIO)</option>
                <option value="retro-blue">DEEP BLUE (DISCO BIOS CLASSICO)</option>
                <option value="custom">TINTA UNITA PERSONALIZZATA</option>
              </select>
            </div>

            {discType === 'custom' && (
              <div className="option-field">
                <label>Colore Custom Superficie CD</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={discColor}
                    onChange={(e) => setDiscColor(e.target.value)}
                    style={{ width: '40px', height: '34px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={discColor.toUpperCase()}
                    onChange={(e) => setDiscColor(e.target.value)}
                    placeholder="#FFFFFF"
                    style={{ flexGrow: 1 }}
                  />
                </div>
                <div className="color-swatches">
                  {SWATCHES.map((swatch) => (
                    <button
                      key={swatch.value}
                      className={`swatch-btn ${discColor === swatch.value ? 'active' : ''}`}
                      style={{ backgroundColor: swatch.value }}
                      onClick={() => setDiscColor(swatch.value)}
                      title={swatch.name}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="option-field">
              <label>Colore Anello Interno</label>
              <input
                type="color"
                value={discRingColor}
                onChange={(e) => setDiscRingColor(e.target.value)}
                style={{ width: '100%', height: '34px', border: 'none', background: 'transparent', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Box Dettagli di Stampa */}
          <div className="options-group">
            <span className="group-title">3. Stampe e Etichette Inchiostro</span>
            
            <div className="option-field">
              <label htmlFor="input-disc-title">Titolo Stampato Sul CD</label>
              <input
                id="input-disc-title"
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={game.title}
                maxLength={20}
              />
            </div>

            <div className="option-field">
              <label htmlFor="select-ink-color">Colore Testi Inchiostro</label>
              <select
                id="select-ink-color"
                value={discTextColor}
                onChange={(e) => setDiscTextColor(e.target.value)}
              >
                <option value="#ffffff">BIANCO GESSO (#FFFFFF)</option>
                <option value="#000000">NERO INCHIOSTRO (#000000)</option>
                <option value="#f59e0b">AMBRA RETRO (#F59E0B)</option>
                <option value="#00f0ff">NEON CIANO (#00F0FF)</option>
              </select>
            </div>

            <div className="option-field">
              <label htmlFor="select-sticker">Adesivo Custom Applicato</label>
              <select
                id="select-sticker"
                value={stickerStyle}
                onChange={(e) => setStickerStyle(e.target.value as StickerStyle)}
              >
                <option value="none">NESSUN ADESIVO</option>
                <option value="demo">ETICHETTA ROSSA "DEMO ONLY"</option>
                <option value="star">STELLA DORATA DA PRESTIGIO</option>
                <option value="retro-grid">SCALETTA RETRO-GRID CIANO</option>
              </select>
            </div>
          </div>

          {/* Azioni */}
          <div className="customizer-actions-row">
            <button type="button" className="retro-btn" onClick={onCancel} style={{ border: 'none' }}>
              ANNULLA
            </button>
            <button type="button" className="retro-btn btn-success" onClick={handleSave}>
              <RetroIcon name="check" size={14} />
              <span>APPLICA STAMPA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Customizer;
