import { useEffect, useRef, useContext, useState } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

const CRAWL_TEXT = `
A long time ago in a terminal far,
far away....




       ╔═══════════════════════════╗
       ║    FOLK.CODES  TERMINAL   ║
       ║        EPISODE IV         ║
       ║                           ║
       ║    A   N E W   H O P E   ║
       ╚═══════════════════════════╝


It is a period of digital unrest.
Rogue developers, striking from a
hidden localhost, have won their
first victory against the evil
Corporate Framework Empire.

During the battle, rebel spies
managed to steal secret plans to
the Empire's ultimate weapon, the
LEGACY CODEBASE — an enterprise
monolith with enough technical debt
to destroy an entire sprint.

Pursued by the Empire's sinister
agents, a lone developer races
home aboard their standing desk,
custodian of the stolen source code
that can save their team and
restore freedom to the galaxy....




       Type 'help' for commands.
       The Force is with you.
       Always.
`;

export default function StarWars() {
  const { enterGameMode, exitGameMode } = useContext(TerminalContext);
  const [quit, setQuit] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (quit) {
      exitGameMode();
      return;
    }
    enterGameMode();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setQuit(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      exitGameMode();
    };
  }, [quit, enterGameMode, exitGameMode]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  if (quit) return null;

  return (
    <div ref={containerRef} className="starwars-container" tabIndex={0}>
      <div className="starwars-crawl-wrapper">
        <div className="starwars-crawl">
          <pre className="starwars-text">{CRAWL_TEXT}</pre>
        </div>
      </div>
      <div className="starwars-hint">ESC to exit</div>
    </div>
  );
}
