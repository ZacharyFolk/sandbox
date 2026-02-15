import Typist from 'react-typist-component';
import { useContext } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

const Welcome = ({ onDone, powerRef }) => {
  const { updateCommand, updateInput } = useContext(TerminalContext);

  const handleClick = (value) => {
    updateCommand(value);
    updateInput('');
  };

  const handleMouseEnter = (value) => {
    updateInput(value);
  };

  return (
    <>
      <Typist
        typingDelay={10}
        onTypingDone={() => {
          if (powerRef.current) onDone();
        }}
      >
        <p>
          Welcome! <br /> <br /> Thank you for visiting! Type some commands and
          see what happens. <br />
          <br /> Type{' '}
          <span
            className="command-link"
            onMouseEnter={() => handleMouseEnter('help')}
            onMouseLeave={() => updateInput('')}
            onClick={() => handleClick('help')}
          >
            help
          </span>{' '}
          for a list of useful commands.
        </p>
      </Typist>
    </>
  );
};

export default Welcome;
