import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import React from 'react';
import Cookies from 'js-cookie';
import Terminal from '../../components/terminal/Terminal';
import SwitchComponent from '../../components/terminal/Switch';
import Intro from '../../components/terminal/Boot';
import { CommandMenu } from '../../components/menus/CommandMenu';
import QuickCommandPanel from '../../components/menus/QuickCommandPanel';
import LcdTicker from '../../components/LcdTicker';
import Screensaver from '../../components/screensaver/Screensaver';
import { TerminalContext } from '../../context/TerminalContext';

export default function Home() {
  const {
    speakerMuted,
    setSpeakerMuted,
    updateCommand,
    screensaver,
    setScreensaver,
    theme,
    setTheme,
  } = useContext(TerminalContext);
  const [viewPrompt, setViewPrompt] = useState(false);
  const [power, setPower] = useState(() => {
    const cookiePower = Cookies.get('power');
    return cookiePower ? cookiePower === 'true' : false;
  });
  const [output, setOutput] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommandPanelOpen, setIsCommandPanelOpen] = useState(false);
  const [lcdMessage, setLcdMessage] = useState(null);
  const clickSoundRef = useRef(new Audio('/sounds/sound_click.mp3'));
  const bingSoundRef = useRef(new Audio('/sounds/monty/monty-python-bing.mp3'));
  const idleTimerRef = useRef(null);

  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    if (power) {
      idleTimerRef.current = setTimeout(() => setScreensaver(true), 30000);
    }
  }, [power, setScreensaver]);

  useEffect(() => {
    resetIdleTimer();
    const events = ['mousemove', 'keydown', 'click', 'touchstart'];
    events.forEach((e) => document.addEventListener(e, resetIdleTimer));
    return () => {
      clearTimeout(idleTimerRef.current);
      events.forEach((e) => document.removeEventListener(e, resetIdleTimer));
    };
  }, [resetIdleTimer]);

  const playSound = (ref) => {
    if (speakerMuted) return;
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  };

  const playClick = () => playSound(clickSoundRef);

  const playDirect = (ref) => {
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  };

  const toggleMute = () => {
    const nextMuted = !speakerMuted;
    playDirect(clickSoundRef);
    setSpeakerMuted(nextMuted);
    if (nextMuted) {
      setLcdMessage('◁╳ AUDIO — MUTED');
    } else {
      setLcdMessage([
        { text: '◁)) AUDIO — ENABLED', delay: 1000 },
        { text: '◁)) 3 . . .', delay: 800 },
        { text: '◁)) 2 . . .', delay: 800 },
        { text: '◁)) 1 . . .', delay: 800 },
        { text: '◁)) ♪ BING', delay: 600 },
      ]);
      setTimeout(() => playDirect(bingSoundRef), 3400);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    power
      ? setOutput(
          <Intro
            setOutput={setOutput}
            setViewPrompt={setViewPrompt}
            power={power}
          />
        )
      : turnOff();
  }, [power]);

  const turnOff = () => {
    setOutput('');
    setViewPrompt(false);
    setScreensaver(false);
    clearTimeout(idleTimerRef.current);
  };

  return (
    <div className={`monitor theme-${theme}`}>
      <div className="bezel crt">
        <Terminal
          output={output}
          setOutput={setOutput}
          viewPrompt={viewPrompt}
          power={power}
        />
        {isCommandPanelOpen && (
          <QuickCommandPanel onClose={() => setIsCommandPanelOpen(false)} />
        )}
        {screensaver && <Screensaver />}
      </div>
      <div className="controls">
        <div className="controls-left">
          <button
            className={`menu-icon ${isMenuOpen ? 'menu-active' : ''}`}
            onClick={toggleMenu}
          >
            ☰
          </button>
          <nav className={`slide-menu ${isMenuOpen ? 'open' : ''}`}>
            <CommandMenu />
          </nav>
        </div>
        <div className="controls-center">
          <div className="speaker-group">
            <div className="speaker-grille">
              <div className="speaker-inner" />
            </div>
            <button
              className={`audio-toggle ${speakerMuted ? 'audio-toggle--off' : ''}`}
              onClick={toggleMute}
              title={speakerMuted ? 'Unmute' : 'Mute'}
              disabled={!power}
            >
              <div className="audio-toggle-gate">
                <div className="audio-toggle-lever" />
              </div>
            </button>
          </div>
          <LcdTicker
            message={lcdMessage}
            onDone={() => setLcdMessage(null)}
            onClick={() => {
              playClick();
              setIsCommandPanelOpen((p) => !p);
            }}
            disabled={!power}
          />
        </div>
        <div className="controls-right">
          <div className="vintage-buttons">
            <button
              className="vtg-btn vtg-btn--round"
              onClick={() => {
                playClick();
                updateCommand('help');
              }}
              disabled={!power}
              title="Help"
            >
              ?
            </button>
            <button
              className="vtg-btn vtg-btn--round vtg-btn--amber"
              onClick={() => {
                playClick();
                const themes = ['phosphor', 'c64', 'amber'];
                const labels = { phosphor: 'PHOSPHOR GREEN', c64: 'COMMODORE 64', amber: 'AMBER PHOSPHOR' };
                const next = themes[(themes.indexOf(theme) + 1) % themes.length];
                setTheme(next);
                setLcdMessage(`◈ THEME — ${labels[next]}`);
              }}
              disabled={!power}
              title="Theme"
            ></button>
            <button
              className={`vtg-btn vtg-btn--square ${screensaver ? 'vtg-btn--active' : ''}`}
              onClick={() => {
                playClick();
                const next = !screensaver;
                setScreensaver(next);
                setLcdMessage(next
                  ? 'SCREENSAVER — DEPLOYED /// PRESS ANY KEY TO DISMISS'
                  : 'SCREENSAVER — DISMISSED /// RESUMING SESSION');
              }}
              disabled={!power}
              title="Screensaver"
            ></button>
          </div>
          <div className="led-cluster">
            <div className="led-row">
              <div className="led-socket">
                <div className={`led led-${power ? 'on' : 'off'}`}></div>
              </div>
              <span className="led-label">PWR</span>
            </div>
            <div className="led-row">
              <div className="led-socket">
                <div
                  className={`led ${power ? 'led-hdd led-hdd-active' : 'led-off'}`}
                ></div>
              </div>
              <span className="led-label">HDD</span>
            </div>
          </div>
          <SwitchComponent power={power} setPower={setPower} />
        </div>
      </div>
    </div>
  );
}
