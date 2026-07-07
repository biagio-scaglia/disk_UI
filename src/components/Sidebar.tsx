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
          <div className="section-label">MEMORY CARD SLOT 1</div>
          <div className="card-slot-well">
            {powerOn && selectedGame ? (
              <div 
                className="inserted-card" 
                style={{ cursor: 'pointer' }}
                onClick={() => onViewChange('detail')}
              >
                <RetroIcon name="memory-card" className="card-icon" size={18} />
                <div className="card-info">
                  <span className="card-title">{selectedGame.title}</span>
                  <span className="card-meta">
                    {selectedGame.installed ? 'BLOCK ACTIVE' : 'UNINSTALLED'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="inserted-card empty">
                {powerOn ? 'EMPTY SLOT' : 'SYSTEM STANDBY'}
              </div>
            )}
          </div>
        </div>

        <div className="slot-container">
          <div className="section-label">SYSTEM CONFIG SLOT 2</div>
          <div className="card-slot-well">
            {powerOn ? (
              <div 
                className={`inserted-card ${activeView === 'customize' ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => onViewChange('customize')}
              >
                <RetroIcon name="settings" className="card-icon" size={18} />
                <div className="card-info">
                  <span className="card-title">Customizer</span>
                  <span className="card-meta">Prints & Cases</span>
                </div>
              </div>
            ) : (
              <div className="inserted-card empty">
                EMPTY SLOT
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
              title="Power ON / OFF"
            >
              <RetroIcon name="power" size={22} />
            </button>
            <div 
              className={`led-light ${powerOn ? (isSpinning ? 'loading' : 'on') : ''}`}
            />
          </div>

          {/* Eject / Reset / Open Lid */}
          <div className="utility-controls">
            <button 
              disabled={!powerOn}
              onClick={onToggleLid}
            >
              <span>{lidOpen ? 'LID CLOSE' : 'LID OPEN'}</span>
              <RetroIcon name="eject" size={14} />
            </button>

            <button 
              disabled={!powerOn || !insertedGameId}
              onClick={onEject}
            >
              <span>EJECT CD</span>
              <RetroIcon name="cd" size={14} />
            </button>

            <button 
              disabled={!powerOn}
              onClick={onReset}
            >
              <span>RESET</span>
              <RetroIcon name="controller" size={14} />
            </button>
          </div>
        </div>

        <div className="system-badge">
          designed by biagio-scaglia
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
