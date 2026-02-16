import { createContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const TerminalContext = createContext('');

export const TerminalProvider = ({ children }) => {
  const [command, setCommand] = useState('');
  const [gameMode, setGameMode] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [screensaver, setScreensaver] = useState(false);
  const [screensaverType, setScreensaverType] = useState(null);
  const [crtFilter, setCrtFilter] = useState(false);
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

  // Enter game mode - hides terminal input, disables click-to-focus, disables body scroll
  const enterGameMode = () => {
    setGameMode(true);
    document.body.style.overflow = 'hidden';
  };

  // Exit game mode - restores normal terminal behavior, body scroll, and input focus.
  // setTimeout defers the focus call until after React re-renders the input element,
  // since the input is conditionally rendered and won't exist in the DOM yet on this tick.
  const exitGameMode = () => {
    setGameMode(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    const urlCommand = getCommandFromUrl();
    if (urlCommand) {
      setCommand(urlCommand);
    }
  }, [location.search]);

  return (
    <TerminalContext.Provider
      value={{
        command,
        updateCommand,
        inputRef,
        updateInput,
        clearInput,
        gameMode,
        enterGameMode,
        exitGameMode,
        speakerMuted,
        setSpeakerMuted,
        screensaver,
        setScreensaver,
        crtFilter,
        setCrtFilter,
        screensaverType,
        setScreensaverType,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
};

export default TerminalProvider;
