import { useEffect, useState } from 'react';

const MESSAGES = {
  crt: {
    on:  '▸ CRT EMULATION ONLINE — scanline gen / phosphor bloom / barrel warp engaged',
    off: '▸ CRT EMULATION OFFLINE — display normalized',
  },
  screensaver: {
    on:  '▸ SCREENSAVER DEPLOYED — press any key to dismiss',
    off: '▸ SCREENSAVER DISMISSED — resuming session',
  },
};

const ToggleNotice = ({ type, active, onDone }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      if (onDone) onDone();
    }, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!visible) return null;

  const msg = MESSAGES[type]?.[active ? 'on' : 'off'] || '';
  return (
    <div className="toggle-notice">
      <span className="toggle-notice-text">{msg}</span>
    </div>
  );
};

export default ToggleNotice;
