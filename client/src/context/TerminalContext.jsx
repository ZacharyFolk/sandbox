import { createContext, useState } from 'react';

export const TerminalContext = createContext('');

export const TerminalProvider = ({ children }) => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');

  const updateCommand = (value) => {
    if (value) {
      setCommand(value);
    }
  };
  const updateOutput = (value) => {
    if (value) {
      setOutput(value);
    }
  };

  return (
    <>
      <TerminalContext.Provider
        value={{ command, updateCommand, output, updateOutput }}
      >
        {children}
      </TerminalContext.Provider>
    </>
  );
};

export default TerminalProvider;
