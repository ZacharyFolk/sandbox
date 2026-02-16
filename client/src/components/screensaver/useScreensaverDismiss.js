import { useEffect, useContext } from 'react';
import { TerminalContext } from '../../context/TerminalContext';

export function useScreensaverDismiss(containerRef) {
  const { setScreensaver, inputRef } = useContext(TerminalContext);

  useEffect(() => {
    const container = containerRef.current;
    const dismiss = () => {
      setScreensaver(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    };
    document.addEventListener('keydown', dismiss);
    container?.addEventListener('click', dismiss);
    return () => {
      document.removeEventListener('keydown', dismiss);
      container?.removeEventListener('click', dismiss);
    };
  }, [setScreensaver, inputRef, containerRef]);
}
