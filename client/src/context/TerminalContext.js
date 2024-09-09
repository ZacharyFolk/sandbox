import { createContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const TerminalContext = createContext('');

export const TerminalProvider = ({ children }) => {
  const [command, setCommand] = useState('');
  const inputRef = useRef(null);
  const location = useLocation();

  const getCommandFromUrl = () => {
    const query = new URLSearchParams(location.search);
    return query.get('command');
  };

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

  useEffect(() => {
    const urlCommand = getCommandFromUrl();
    if (urlCommand) {
      setCommand(urlCommand);
    }
  }, [location.search]);

  return (
    <TerminalContext.Provider
      value={{ command, updateCommand, inputRef, updateInput, clearInput }}
    >
      {children}
    </TerminalContext.Provider>
  );
};

export default TerminalProvider;
