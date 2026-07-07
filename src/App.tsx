import { useState, useEffect } from 'react';
import { Game, ConsoleState, GameCustomization } from './types';
import Sidebar from './components/Sidebar';
import DiscTray from './components/DiscTray';
import LibraryView from './components/LibraryView';
import GameDetail from './components/GameDetail';
import Customizer from './components/Customizer';
import ArtworkManager from './components/ArtworkManager';
import RetroIcon from './components/RetroIcon';
import './styles/main.scss';


// Giochi Mock di partenza (Retro Cult Classici)
const INITIAL_GAMES: Game[] = [
  {
    id: 'res-evil-2',
    title: 'Resident Evil 2',
    developer: 'Capcom',
    releaseYear: '1998',
    genre: 'Survival Horror',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400',
    installed: true,
    lastPlayed: '15 GEN 1999',
    playTime: '24h 15m',
    customization: {
      coverStyle: 'platinum',
      discType: 'vinyl-black',
      discColor: '#a0a4ab',
      discRingColor: '#b0b5be',
      discTextColor: '#ffffff',
      stickerStyle: 'none',
      customTitle: 'Biohazard 2',
    },
  },
  {
    id: 'metal-gear',
    title: 'Metal Gear Solid',
    developer: 'Konami',
    releaseYear: '1998',
    genre: 'Stealth Action',
    coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=400',
    installed: true,
    lastPlayed: '03 SET 1998',
    playTime: '42h 00m',
    customization: {
      coverStyle: 'black-label',
      discType: 'classic-silver',
      discColor: '#1f2937',
      discRingColor: '#6b7280',
      discTextColor: '#00f0ff',
      stickerStyle: 'demo',
      customTitle: 'MGS - DISCO 1',
    },
  },
  {
    id: 'crash-bandicoot',
    title: 'Crash Bandicoot',
    developer: 'Naughty Dog',
    releaseYear: '1996',
    genre: 'Platformer',
    coverUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400',
    installed: true,
    lastPlayed: 'OGGI',
    playTime: '8h 45m',
    customization: {
      coverStyle: 'standard',
      discType: 'retro-blue',
      discColor: '#1e40af',
      discRingColor: '#1d4ed8',
      discTextColor: '#f59e0b',
      stickerStyle: 'star',
      customTitle: 'Crash 1',
    },
  },
  {
    id: 'silent-hill',
    title: 'Silent Hill',
    developer: 'Konami',
    releaseYear: '1999',
    genre: 'Psychological Horror',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=400',
    installed: false,
    customization: {
      coverStyle: 'holographic',
      discType: 'custom',
      discColor: '#ea580c',
      discRingColor: '#7c3aed',
      discTextColor: '#ffffff',
      stickerStyle: 'retro-grid',
      customTitle: 'Silent Hill',
    },
  },
];

function App() {
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('console_games');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_GAMES;
      }
    }
    return INITIAL_GAMES;
  });

  useEffect(() => {
    localStorage.setItem('console_games', JSON.stringify(games));
  }, [games]);

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  
  // Stato hardware della console
  const [consoleState, setConsoleState] = useState<ConsoleState>({
    powerOn: false,
    lidOpen: false,
    activeView: 'library',
    selectedGameId: null,
    insertedGameId: null,
    isSpinning: false,
    isTransitioning: false,
  });

  // BIOS boot log states
  const [isBooting, setIsBooting] = useState(false);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  
  // Game running state
  const [runningGame, setRunningGame] = useState<Game | null>(null);

  // Monitora lo spegnimento per resettare le animazioni
  const togglePower = () => {
    if (consoleState.powerOn) {
      // Spegnimento immediato
      setConsoleState({
        powerOn: false,
        lidOpen: false,
        activeView: 'library',
        selectedGameId: null,
        insertedGameId: null,
        isSpinning: false,
        isTransitioning: false,
      });
      setSelectedGameId(null);
      setRunningGame(null);
      setIsBooting(false);
    } else {
      // Accensione con sequenza BIOS boot
      setConsoleState((prev) => ({ ...prev, powerOn: true }));
      triggerBiosBoot();
    }
  };

  // Simula la sequenza di diagnostica del BIOS retro
  const triggerBiosBoot = () => {
    setIsBooting(true);
    setBootLogs([]);
    
    const logs = [
      'DISK_UI HARDWARE ROM v1.02',
      'CPU INIZIALIZZAZIONE... OK (33MHz)',
      'GRAFICA GPU CHIP... VERIFICATO (16 BIT)',
      'RAM DI SISTEMA... OK (2048KB)',
      'VERIFICA PORTA CONTROLLER 1... COLLEGATO',
      'MONTAGGIO MEMORY CARD SLOT 1... PRONTO',
      'TEST LASER CD-ROM... COMPLETATO',
      'CARICAMENTO INTERFACCIA UTENTE...',
      'CONSOLE OPERATIVA - BIOS DISK_UI PRONTO'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setBootLogs((prev) => [...prev, log]);
        if (index === logs.length - 1) {
          setTimeout(() => {
            setIsBooting(false);
          }, 600);
        }
      }, (index + 1) * 200);
    });
  };

  // Pulsante Reset della console
  const resetConsole = () => {
    if (!consoleState.powerOn) return;
    setConsoleState((prev) => ({
      ...prev,
      isSpinning: false,
      isTransitioning: false,
      insertedGameId: null,
      activeView: 'library'
    }));
    setRunningGame(null);
    triggerBiosBoot();
  };

  // Apertura/Chiusura coperchio CD
  const toggleLid = () => {
    if (!consoleState.powerOn) return;

    setConsoleState((prev) => {
      const nextLidState = !prev.lidOpen;
      let spinning = prev.isSpinning;
      
      // Se apriamo il coperchio, il CD smette di girare istantaneamente!
      if (nextLidState) {
        spinning = false;
      }

      return {
        ...prev,
        lidOpen: nextLidState,
        isSpinning: spinning,
      };
    });
  };

  // Inserimento del CD selezionato nel lettore
  const insertDisc = () => {
    if (!consoleState.powerOn || !consoleState.lidOpen || !selectedGameId || consoleState.insertedGameId) return;

    setConsoleState((prev) => ({ ...prev, isTransitioning: true }));

    // Simula l'animazione di discesa fisica del disco
    setTimeout(() => {
      setConsoleState((prev) => ({
        ...prev,
        insertedGameId: selectedGameId,
        isTransitioning: false,
      }));
    }, 450);
  };

  // Espulsione manuale del CD dal lettore
  const ejectDisc = () => {
    if (!consoleState.powerOn || !consoleState.lidOpen || !consoleState.insertedGameId) return;

    setConsoleState((prev) => ({ ...prev, isTransitioning: true }));

    // Simula l'animazione di sollevamento del disco prima di rimuoverlo
    setTimeout(() => {
      setConsoleState((prev) => ({
        ...prev,
        insertedGameId: null,
        isSpinning: false,
        isTransitioning: false,
      }));
    }, 350);
  };

  // Seleziona un gioco per visualizzarne i dettagli
  const selectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setConsoleState((prev) => ({
      ...prev,
      activeView: 'detail',
      selectedGameId: gameId,
    }));
  };

  // Boot del gioco inserito
  const bootGame = () => {
    const game = games.find((g) => g.id === consoleState.insertedGameId);
    if (!game || !game.installed || consoleState.lidOpen || consoleState.isSpinning) return;

    // 1. Gira il CD
    setConsoleState((prev) => ({ ...prev, isSpinning: true }));

    // 2. Simula il caricamento laser prima dell'avvio reale
    setTimeout(() => {
      // Entra nello schermo intero del gioco in esecuzione
      setRunningGame(game);
    }, 1800);
  };

  // Esci dal gioco per tornare al dettaglio
  const exitRunningGame = () => {
    setRunningGame(null);
    setConsoleState((prev) => ({ ...prev, isSpinning: false }));
  };

  // Installa un gioco non installato (mock)
  const installGame = (gameId: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === gameId ? { ...g, installed: true, lastPlayed: 'ADESSO' } : g))
    );
  };

  // Aggiungi un gioco
  const addGame = (gameData: Omit<Game, 'id' | 'customization'>) => {
    const newId = `game-${Date.now()}`;
    const newGame: Game = {
      ...gameData,
      id: newId,
      customization: {
        coverStyle: 'standard',
        discType: 'vinyl-black',
        discColor: '#a0a4ab',
        discRingColor: 'rgba(255,255,255,0.2)',
        discTextColor: '#ffffff',
        stickerStyle: 'none',
        customTitle: gameData.title,
      },
    };
    setGames((prev) => [...prev, newGame]);
  };

  // Cancella un blocco gioco
  const deleteGame = (gameId: string) => {
    setGames((prev) => prev.filter((g) => g.id !== gameId));
    if (consoleState.insertedGameId === gameId) {
      setConsoleState((prev) => ({ ...prev, insertedGameId: null, isSpinning: false }));
    }
    setSelectedGameId(null);
    setConsoleState((prev) => ({ ...prev, activeView: 'library', selectedGameId: null }));
  };

  // Salva la personalizzazione
  const saveCustomization = (customization: GameCustomization) => {
    if (!selectedGameId) return;
    setGames((prev) =>
      prev.map((g) => (g.id === selectedGameId ? { ...g, customization } : g))
    );
    setConsoleState((prev) => ({ ...prev, activeView: 'detail' }));
  };

  // Salva l'artwork da SteamGridDB
  const saveArtwork = (
    gameId: string,
    artwork: {
      coverUrl: string;
      heroUrl?: string;
      logoUrl?: string;
      iconUrl?: string;
    }
  ) => {
    setGames((prev) =>
      prev.map((g) =>
        g.id === gameId
          ? {
              ...g,
              coverUrl: artwork.coverUrl,
              heroUrl: artwork.heroUrl,
              logoUrl: artwork.logoUrl,
              iconUrl: artwork.iconUrl,
            }
          : g
      )
    );
  };

  // Carica i giochi di default (Mock BIOS format)
  const formatAndLoadDefaults = () => {
    setGames(INITIAL_GAMES);
  };

  const selectedGame = games.find((g) => g.id === selectedGameId) || null;
  const insertedGame = games.find((g) => g.id === consoleState.insertedGameId) || null;

  // --- RENDERING SCHERMO DI ACCENSIONE DIRETTA (PITCH BLACK) ---
  if (!consoleState.powerOn) {
    return (
      <div className="console-layout-off" style={{ height: '100vh', display: 'flex', backgroundColor: '#090a0c', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div 
            style={{
              width: '120px', height: '120px', borderRadius: '50%',
              backgroundColor: '#1f2026', border: '3px solid #363842',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.6)', cursor: 'pointer',
            }}
            onClick={togglePower}
            title="Premi per avviare"
          >
            <RetroIcon name="power" size={48} color="#ef4444" />
          </div>
          <span className="text-mono" style={{ color: '#7e8394', letterSpacing: '0.15em', fontSize: '0.75rem' }}>
            ACCENDI SISTEMA CONSOLE
          </span>
        </div>
      </div>
    );
  }

  // --- RENDERING SCHERMO BIOS DIAGNOSTICA (BOOT SEQUENCE) ---
  if (isBooting) {
    return (
      <div className="bios-boot-screen" style={{ height: '100vh', backgroundColor: '#000', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: '"Share Tech Mono", monospace', color: '#8a8d9b' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bootLogs.map((log, i) => (
            <div key={i} style={{ fontSize: '0.9rem', color: log.includes('OK') || log.includes('PRONTO') ? '#10b981' : '#e4e6eb' }}>
              &gt; {log}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', borderTop: '1px solid #222', paddingTop: '15px' }}>
          <span>PORT 1: MEMORY CARD INSERITA</span>
          <span>SYSTEM CHECK: SUCCESSFUL</span>
        </div>
      </div>
    );
  }

  // --- RENDERING GIOCO IN ESECUZIONE (MOCK RUNNING STATE) ---
  if (runningGame) {
    return (
      <div className="game-running-overlay" style={{ height: '100vh', width: '100vw', backgroundColor: '#050608', position: 'fixed', top: 0, left: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', padding: '30px', justifyContent: 'space-between', fontFamily: '"Share Tech Mono", monospace' }}>
        <div style={{ border: '2px solid #222', flexGrow: 1, margin: '20px 0', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0e1015', position: 'relative', overflow: 'hidden' }}>
          {/* Subtle Scanline Overlay */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
            backgroundSize: '100% 4px', pointerEvents: 'none', opacity: 0.3
          }} />
          
          <div style={{ animation: 'disc-spin 6s infinite linear', opacity: 0.15, position: 'absolute' }}>
            <RetroIcon name="cd" size={320} color="#3b93ff" />
          </div>

          <div style={{ zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
              {runningGame.title.toUpperCase()}
            </h1>
            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
              ESECUZIONE CD-ROM IN CORSO
            </div>
            <div style={{ color: '#8a8d9b', fontSize: '0.8rem', marginTop: '10px' }}>
              Sviluppatore: {runningGame.developer.toUpperCase()} ({runningGame.releaseYear})
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#444' }}>EMULATION CONSOLE ENVIRONMENT v1.02</span>
          <button 
            className="retro-btn" 
            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            onClick={exitRunningGame}
          >
            <span>ESCI E SPEGNI LASER</span>
            <RetroIcon name="close" size={14} />
          </button>
        </div>
      </div>
    );
  }

  // --- INTERFACCIA CONSOLE PRINCIPALE OPERATIVA ---
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#121316' }}>
      {/* Sidebar Hardware Sinistra */}
      <Sidebar
        consoleState={consoleState}
        selectedGame={selectedGame}
        onTogglePower={togglePower}
        onToggleLid={toggleLid}
        onEject={ejectDisc}
        onReset={resetConsole}
        onViewChange={(view) => setConsoleState((prev) => ({ ...prev, activeView: view }))}
      />

      {/* Area Centrale Principale (Libreria, Dettaglio, Personalizzatore) */}
      <main style={{ flexGrow: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {consoleState.activeView === 'library' && (
          <LibraryView
            games={games}
            onSelectGame={selectGame}
            onAddGame={addGame}
            onLoadMockData={formatAndLoadDefaults}
          />
        )}

        {consoleState.activeView === 'detail' && selectedGame && (
          <GameDetail
            game={selectedGame}
            consoleState={consoleState}
            onBack={() => setConsoleState((prev) => ({ ...prev, activeView: 'library' }))}
            onBoot={bootGame}
            onInsertDisc={insertDisc}
            onInstall={() => installGame(selectedGame.id)}
            onCustomize={() => setConsoleState((prev) => ({ ...prev, activeView: 'customize' }))}
            onDelete={() => deleteGame(selectedGame.id)}
            onManageArtwork={() => setConsoleState((prev) => ({ ...prev, activeView: 'artwork' }))}
          />
        )}

        {consoleState.activeView === 'customize' && selectedGame && (
          <Customizer
            game={selectedGame}
            onSave={saveCustomization}
            onCancel={() => setConsoleState((prev) => ({ ...prev, activeView: 'detail' }))}
          />
        )}

        {consoleState.activeView === 'artwork' && selectedGame && (
          <ArtworkManager
            game={selectedGame}
            onBack={() => setConsoleState((prev) => ({ ...prev, activeView: 'detail' }))}
            onSaveArtwork={saveArtwork}
          />
        )}
      </main>

      {/* Vano Lettore CD Fisico Destro (Layout Desktop Console) */}
      <div 
        style={{
          width: '360px',
          height: '100%',
          backgroundColor: '#1b1c22',
          borderLeft: '4px solid #131418',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          flexShrink: 0
        }}
      >
        <DiscTray
          consoleState={consoleState}
          insertedGame={insertedGame}
          onInsertDisc={insertDisc}
        />
      </div>
    </div>
  );
}

export default App;
