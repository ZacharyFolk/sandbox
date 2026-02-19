import Typist from 'react-typist-component';
import { useContext } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

const Help = () => {
  const { updateCommand, updateInput } = useContext(TerminalContext);

  const handleClick = (value) => {
    console.log('You clicked ', value);
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

  const commands = ['about', 'projects', 'contact', 'photos', 'latest'];

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
    'cowsay',
    '8ball',
    'tarot',
  ];

  return (
    <Typist typingDelay={10}>
      <h4>Useful commands</h4>
      <ul className="help-list">
        {commands.map((command) => (
          <li
            key={command}
            onMouseEnter={() => handleMouseEnter(command)}
            onTouchStart={() => handleTouchStart(command)}
            onMouseLeave={() => updateInput('')}
            onClick={() => handleClick(command)}
            className="command-link"
          >
            {command}
          </li>
        ))}
      </ul>
      <br />
      <h4>Free eggs</h4>
      <ul className="help-list">
        {eggs.map((egg) => (
          <li
            key={egg}
            onMouseEnter={() => handleMouseEnter(egg)}
            onTouchStart={() => handleTouchStart(egg)}
            onMouseLeave={() => updateInput('')}
            onClick={() => handleClick(egg)}
            className="command-link"
          >
            {egg}
          </li>
        ))}
      </ul>
      <br />
      <p>
        There is a response for whatever you type, maybe not what you expected,
        but you may find more eggs.
      </p>
      <p>
        You can type <span class="highlight">?</span> if you want to see this
        screen again.
      </p>
    </Typist>
  );
};

export default Help;
