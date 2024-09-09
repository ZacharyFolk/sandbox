import { useContext } from 'react';
import { TerminalContext } from '../../context/TerminalContext';

export const CommandMenu = () => {
  const { updateCommand, updateInput } = useContext(TerminalContext);

  const handleClick = (value) => {
    console.log('You clicked ', value);
    updateCommand(value);
    updateInput('');
  };

  const handleMouseEnter = (value) => {
    updateInput(value);
  };
  const commands = ['about', 'projects', 'contact', 'help'];

  return (
    <ul>
      {commands.map((command) => (
        <li
          key={command}
          onMouseEnter={() => handleMouseEnter(command)}
          onMouseLeave={() => updateInput('')}
          onClick={() => handleClick(command)}
          className="command-link"
        >
          {command}
        </li>
      ))}
    </ul>
  );
};
