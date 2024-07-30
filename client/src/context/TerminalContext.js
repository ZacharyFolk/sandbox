import { createContext, useState, useRef } from 'react';

export const TerminalContext = createContext('');

export const TerminalProvider = ({ children }) => {
  const [command, setCommand] = useState('');
  const inputRef = useRef(null);

  const updateCommand = (value) => {
    if (value) {
      setCommand(value);
    }
  };

  const updateInput = (value) => {
    if (inputRef.current) {
      inputRef.current.innerText = value;
      inputRef.current.focus();
    }
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.innerText = '';
    }
  };

  return (
    <TerminalContext.Provider
      value={{ command, updateCommand, inputRef, updateInput, clearInput }}
    >
      {children}
    </TerminalContext.Provider>
  );
};

export default TerminalProvider;
