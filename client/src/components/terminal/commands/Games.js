import { useContext } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

const games = ['snake', 'tetris', 'cagematch', 'hack', 'password', 'matrix', 'codeword', 'hangman'];

const SCENE = `        /\\               /\\          /\\             /\\
   /\\  /  \\    /\\    /\\ /  \\   /\\  /  \\   /\\    /  \\   /\\
  /  \\/    \\__/  \\__/  \\/    \\_/  \\/    \\_/  \\__/    \\_/  \\
 /                                                             \\
/_______________________________________________________________\\
                            [ + ]`;

const RADAR = `  RADAR  [  ·  ·  ·  ●  ·  ·  ·  ]   THREAT: NULL   HIT: 000`;

const Games = () => {
  const { updateCommand, updateInput } = useContext(TerminalContext);

  const handleClick = (value) => {
    updateCommand(value);
    updateInput('');
  };

  const handleMouseEnter = (value) => {
    if (!('ontouchstart' in window)) {
      updateInput(value);
    }
  };

  const handleTouchStart = (value) => {
    updateInput(value);
  };

  return (
    <div className="bz-hud">
      <pre className="bz-scene">{SCENE}</pre>
      <div className="bz-select">&gt;&gt;&gt;  S E L E C T  A  G A M E  &lt;&lt;&lt;</div>
      <div className="bz-games">
        {games.map((game, i) => (
          <span
            key={game}
            style={{ animationDelay: `${0.3 + i * 0.12}s` }}
            onMouseEnter={() => handleMouseEnter(game)}
            onTouchStart={() => handleTouchStart(game)}
            onMouseLeave={() => updateInput('')}
            onClick={() => handleClick(game)}
            className="command-link bz-target"
          >
            [ {game} ]
          </span>
        ))}
      </div>
      <pre className="bz-radar">{RADAR}</pre>
    </div>
  );
};

export default Games;
