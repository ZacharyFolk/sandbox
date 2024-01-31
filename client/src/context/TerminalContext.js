import { createContext, useState } from 'react';

export const TerminalContext = createContext('');

export const TerminalProvider = ({ children }) => {
  const [command, setCommand] = useState(TerminalContext.command || '');

  const updateCommand = (value) => {
    if (value) {
      setCommand(value);
    }
  };

  return (
    <>
      <TerminalContext.Provider value={{ command, updateCommand }}>
        {children}
      </TerminalContext.Provider>
    </>
  );
};

export default TerminalProvider;
