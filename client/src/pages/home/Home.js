import { useContext, useEffect, useRef, useState } from 'react';
import React from 'react';
import Cookies from 'js-cookie';
import Terminal from '../../components/terminal/Terminal';
import SwitchComponent from '../../components/terminal/Switch';
import Intro from '../../components/terminal/Boot';
import { CommandMenu } from '../../components/menus/CommandMenu';
import QuickCommandPanel from '../../components/menus/QuickCommandPanel';
import SecretScroll from '../../components/terminal/commands/SecretScroll';
import AudioNotice from '../../components/terminal/commands/AudioNotice';
import { TerminalContext } from '../../context/TerminalContext';

export default function Home() {
  const { speakerMuted, setSpeakerMuted } = useContext(TerminalContext);
  const [viewPrompt, setViewPrompt] = useState(false);
  const [power, setPower] = useState(() => {
    const cookiePower = Cookies.get('power');
    return cookiePower ? cookiePower === 'true' : false;
  });
  const [output, setOutput] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommandPanelOpen, setIsCommandPanelOpen] = useState(false);
  const clickSoundRef = useRef(new Audio('/sounds/sound_click.mp3'));
  const bingSoundRef  = useRef(new Audio('/sounds/monty/monty-python-bing.mp3'));

  const playSound = (ref) => {
    if (speakerMuted) return;
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  };

  const playClick = () => playSound(clickSoundRef);

  const triggerSecretScroll = () => {
    playClick();
    setTimeout(() => {
      setOutput(
        <SecretScroll onDone={() => setTimeout(() => setOutput(''), 600)} />
      );
    }, 350);
  };

  const toggleMute = () => {
    if (!speakerMuted) playClick(); // last click before muting
    const nextMuted = !speakerMuted;
    setSpeakerMuted(nextMuted);
    setOutput(
      <AudioNotice
        muted={nextMuted}
        onDone={nextMuted ? undefined : () => playSound(bingSoundRef)}
      />
    );
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
  };

  return (
    <div className="monitor">
      <div className="bezel">
        <Terminal
          output={output}
          setOutput={setOutput}
          viewPrompt={viewPrompt}
          power={power}
        />
        {isCommandPanelOpen && (
          <QuickCommandPanel onClose={() => setIsCommandPanelOpen(false)} />
        )}
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
          <button
            className={`monitor-nameplate ${isCommandPanelOpen ? 'monitor-nameplate--active' : ''}`}
            onClick={() => { playClick(); setIsCommandPanelOpen((p) => !p); }}
            title="Quick commands"
          >
            <span className="nameplate-symbol">&gt;_</span>
            <span className="nameplate-text">folk.codes</span>
          </button>
          <div className="speaker-grille">
            <div className="speaker-inner" />
          </div>
          <div className="audio-panel">
            <button
              className={`audio-toggle ${speakerMuted ? 'audio-toggle--off' : ''}`}
              onClick={toggleMute}
              title={speakerMuted ? 'Unmute' : 'Mute'}
            >
              <div className="audio-toggle-gate">
                <div className="audio-toggle-lever" />
              </div>
            </button>
            <div className="audio-lcd">
              <span className="audio-lcd-screen">
                {speakerMuted ? '▷╳' : '▷))'}
              </span>
            </div>
          </div>
        </div>
        <div className="controls-right">
          <div className="vintage-buttons">
            <button className="vtg-btn vtg-btn--round" onClick={playClick} title=""></button>
            <button className="vtg-btn vtg-btn--round vtg-btn--amber" onClick={playClick} title=""></button>
            <button className="vtg-btn vtg-btn--square" onClick={triggerSecretScroll} title=""></button>
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
                <div className={`led led-hdd ${power ? 'led-hdd-active' : 'led-off'}`}></div>
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
