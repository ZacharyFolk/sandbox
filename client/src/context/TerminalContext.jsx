import { createContext, useState, useReducer } from 'react';
import TerminalReducer from './TerminalReducer';
export const TerminalContext = createContext('');

export const TerminalProvider = ({ children }) => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const [state, dispatch] = useReducer(TerminalReducer, '');

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
        value={{ command, updateCommand, output, updateOutput, dispatch }}
      >
        {children}
      </TerminalContext.Provider>
    </>
  );
};

export default TerminalProvider;
