import React from 'react';

export type IconName =
  | 'cd'
  | 'memory-card'
  | 'controller'
  | 'power'
  | 'eject'
  | 'plus'
  | 'settings'
  | 'close'
  | 'play'
  | 'trash'
  | 'customize'
  | 'check'
  | 'arrow-left'
  | 'chevron-right'
  | 'star';

interface RetroIconProps {
  name: IconName;
  className?: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const RetroIcon: React.FC<RetroIconProps> = ({
  name,
  className = '',
  size = 24,
  color = 'currentColor',
  style = {},
}) => {
  const getIconSvg = () => {
    switch (name) {
      case 'cd':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            {/* Disco esterno */}
            <circle cx="12" cy="12" r="10" />
            {/* Anello interno */}
            <circle cx="12" cy="12" r="3" />
            {/* Foro centrale */}
            <circle cx="12" cy="12" r="1.2" fill={color} />
            {/* Riflessi del laser */}
            <line x1="6.34" y1="6.34" x2="9" y2="9" />
            <line x1="15" y1="15" x2="17.66" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="15" y2="9" />
            <line x1="9" y1="15" x2="6.34" y2="17.66" />
          </svg>
        );

      case 'memory-card':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            {/* Corpo principale */}
            <path d="M4 2h16v16c0 1-1 2-2 2H6c-1 0-2-1-2-2V2z" />
            {/* Scanalatura superiore di inserimento */}
            <path d="M7 2v4h10V2" />
            {/* Finestra dei contatti dorati */}
            <rect x="9" y="8" width="6" height="3" fill="none" strokeWidth="1.5" />
            <line x1="11" y1="8" x2="11" y2="11" />
            <line x1="13" y1="8" x2="13" y2="11" />
            {/* Grip grip sul corpo inferiore */}
            <line x1="7" y1="15" x2="17" y2="15" />
            <line x1="7" y1="17" x2="17" y2="17" />
          </svg>
        );

      case 'controller':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            {/* Scocca controller retro */}
            <rect x="2" y="7" width="20" height="11" rx="2.5" />
            {/* Grip laterali */}
            <path d="M2 14c-1 1-1 3.5 1 4s3.5-.5 3.5-.5" />
            <path d="M22 14c1 1 1 3.5-1 4s-3.5-.5-3.5-.5" />
            {/* Croce direzionale (D-Pad) */}
            <path d="M6 10v5M4 12h4" />
            {/* Pulsanti di azione (destra) */}
            <circle cx="16" cy="11" r="1" fill={color} />
            <circle cx="19" cy="13" r="1" fill={color} />
            <circle cx="16" cy="15" r="1" fill={color} />
            {/* Select e Start */}
            <line x1="10" y1="13" x2="11.5" y2="13" strokeWidth="1.5" />
            <line x1="12.5" y1="13" x2="14" y2="13" strokeWidth="1.5" />
          </svg>
        );

      case 'power':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            {/* Simbolo di alimentazione hardware */}
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
            <line x1="12" y1="2" x2="12" y2="12" />
          </svg>
        );

      case 'eject':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            {/* Triangolo di espulsione */}
            <polygon points="12,5 5,14 19,14" fill="none" />
            {/* Barra inferiore */}
            <line x1="5" y1="18" x2="19" y2="18" />
          </svg>
        );

      case 'plus':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        );

      case 'settings':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            {/* Ingranaggio a 8 denti netti (retro-style) */}
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        );

      case 'close':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        );

      case 'play':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            {/* Pulsante play pieno ma geometrico */}
            <polygon points="6,4 20,12 6,20" fill={color} />
          </svg>
        );

      case 'trash':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        );

      case 'customize':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            {/* Pennello / Matita retro-style */}
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        );

      case 'check':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        );

      case 'arrow-left':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12,19 5,12 12,5" />
          </svg>
        );

      case 'chevron-right':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        );

      case 'star':
        return (
          <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth="2" strokeLinecap="square">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
          </svg>
        );

      default:
        return null;
    }
  };

  return <span className={`retro-icon-wrapper ${className}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>{getIconSvg()}</span>;
};
export default RetroIcon;
