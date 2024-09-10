import { useEffect, useState } from 'react';
import React from 'react';
import Cookies from 'js-cookie';
import Terminal from '../../components/terminal/Terminal';
import SwitchComponent from '../../components/terminal/Switch';
import Intro from '../../components/terminal/Boot';
import { CommandMenu } from '../../components/menus/CommandMenu';

export default function Home() {
  const [viewPrompt, setViewPrompt] = useState(false);
  const [power, setPower] = useState(() => {
    const cookiePower = Cookies.get('power');
    return cookiePower ? cookiePower === 'true' : false;
  });
  const [output, setOutput] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <div className="controls-right">
          <SwitchComponent power={power} setPower={setPower} />
          <div className="light">
            <div className={`led led-${power ? 'on' : 'off'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
