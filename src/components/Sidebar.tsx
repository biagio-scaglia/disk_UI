import React from 'react';
import { ConsoleState, Game, ActiveView } from '../types';
import RetroIcon from './RetroIcon';

interface SidebarProps {
  consoleState: ConsoleState;
  selectedGame: Game | null;
  onTogglePower: () => void;
  onToggleLid: () => void;
  onEject: () => void;
  onReset: () => void;
  onViewChange: (view: ActiveView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  consoleState,
  selectedGame,
  onTogglePower,
  onToggleLid,
  onEject,
  onReset,
  onViewChange,
}) => {
  const { powerOn, lidOpen, activeView, insertedGameId, isSpinning } = consoleState;

  return (
    <aside className="console-sidebar">
      {/* Intestazione Brand / Logo */}
      <div className="sidebar-header">
        <h1 className="brand-title" style={{ cursor: 'pointer' }} onClick={() => powerOn && onViewChange('library')}>
          DISK<span>_UI</span>
        </h1>
        <div className="brand-sub">Console System</div>
      </div>

      {/* Sezione Centrale: Memory Card Slots */}
      <div className="sidebar-section">
        <div className="slot-container">
          <div className="section-label">Slot 1 - Memory Card</div>
          <div className="card-slot-well">
            <div className="slot-label">
              <span>CARD MEMORY</span>
              <span>8 BLOCKS</span>
            </div>
            {powerOn && selectedGame ? (
              <div 
                className="inserted-card" 
                style={{ cursor: 'pointer' }}
                onClick={() => onViewChange('detail')}
              >
                <RetroIcon name="memory-card" className="card-icon" size={20} />
                <div className="card-info">
                  <span className="card-title">{selectedGame.title}</span>
                  <span className="card-meta">
                    {selectedGame.installed ? 'SALVATO' : 'NON INST.'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="inserted-card empty">
                {powerOn ? 'INSERIRE MEMORY' : 'CONSOLE SPENTA'}
              </div>
            )}
          </div>
        </div>

        <div className="slot-container">
          <div className="section-label">Slot 2 - System Config</div>
          <div className="card-slot-well">
            <div className="slot-label">
              <span>SYSTEM STATE</span>
              <span>ROM v1.02</span>
            </div>
            {powerOn ? (
              <div 
                className={`inserted-card ${activeView === 'customize' ? 'active' : ''}`}
                style={{ cursor: 'pointer', background: activeView === 'customize' ? 'darken($color-accent-blue, 5%)' : '' }}
                onClick={() => onViewChange('customize')}
              >
                <RetroIcon name="settings" className="card-icon" size={20} />
                <div className="card-info">
                  <span className="card-title">Personalizzatore</span>
                  <span className="card-meta">Copertine & Dischi</span>
                </div>
              </div>
            ) : (
              <div className="inserted-card empty">
                SLOT VUOTO
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sezione Inferiore: Pulsanti Hardware & LED */}
      <div className="sidebar-footer">
        <div className="hardware-controls">
          {/* Pulsante POWER e LED */}
          <div className="power-btn-container">
            <button
              className={`power-btn ${powerOn ? 'on' : ''}`}
              onClick={onTogglePower}
              title="Accendi/Spegni Console"
            >
              <RetroIcon name="power" size={24} />
            </button>
            <div 
              className={`led-light ${powerOn ? (isSpinning ? 'loading' : 'on') : ''}`}
            />
            <span className="text-mono" style={{ fontSize: '0.55rem', color: '#7e8394', marginTop: '2px' }}>POWER</span>
          </div>

          {/* Eject / Reset / Open Lid */}
          <div className="utility-controls">
            <button 
              disabled={!powerOn}
              onClick={onToggleLid}
            >
              <span>{lidOpen ? 'CHIUDI SPORTELLO' : 'APRI LETTORE'}</span>
              <RetroIcon name="eject" size={16} />
            </button>

            <button 
              disabled={!powerOn || !insertedGameId}
              onClick={onEject}
            >
              <span>ESPELI CD</span>
              <RetroIcon name="cd" size={16} />
            </button>

            <button 
              disabled={!powerOn}
              onClick={onReset}
            >
              <span>RESET</span>
              <RetroIcon name="controller" size={16} />
            </button>
          </div>
        </div>

        <div className="system-badge">
          Designed by Antigravity
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
