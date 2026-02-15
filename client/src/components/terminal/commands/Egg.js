import { useContext } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

const eggs = [
  'deep',
  'tetris',
  'cagematch',
  'hack',
  'password',
  'info',
  'blog',
  'fortune',
  'matrix',
];

const Egg = () => {
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
    <div className="egg-box">
      <img src="/images/egg.png" alt="Easter egg" className="egg-gif" />
      <ul className="egg-list">
        {eggs.map((egg, i) => (
          <li
            key={egg}
            style={{ animationDelay: `${i * 0.15}s` }}
            onMouseEnter={() => handleMouseEnter(egg)}
            onTouchStart={() => handleTouchStart(egg)}
            onMouseLeave={() => updateInput('')}
            onClick={() => handleClick(egg)}
            className="command-link egg-item"
          >
            {egg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Egg;
