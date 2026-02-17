import { useEffect, useRef, useState } from 'react';

const LcdTicker = ({ message, onDone, onClick, disabled }) => {
  const [current, setCurrent] = useState(null);
  const timerRef = useRef(null);
  const seqRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    clearInterval(seqRef.current);

    if (!message) {
      setCurrent(null);
      return;
    }

    // If message is an array, step through it as a timed sequence
    if (Array.isArray(message)) {
      let i = 0;
      setCurrent(message[0].text);
      const advance = () => {
        i++;
        if (i < message.length) {
          setCurrent(message[i].text);
          timerRef.current = setTimeout(advance, message[i].delay || 800);
        } else {
          timerRef.current = setTimeout(() => {
            setCurrent(null);
            if (onDone) onDone();
          }, message[message.length - 1].delay || 800);
        }
      };
      timerRef.current = setTimeout(advance, message[0].delay || 800);
    } else {
      // Simple string — show and auto-dismiss
      setCurrent(message);
      timerRef.current = setTimeout(() => {
        setCurrent(null);
        if (onDone) onDone();
      }, 3000);
    }

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(seqRef.current);
    };
  }, [message, onDone]);

  return (
    <button
      className={`lcd-ticker ${current ? 'lcd-ticker--active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title="Quick commands"
    >
      <div className="lcd-ticker-screen">
        {current ? (
          <span key={current} className="lcd-ticker-text">
            {current}
          </span>
        ) : (
          <span className="lcd-ticker-idle">
            <span className="lcd-ticker-cursor">&gt;_</span> folk.codes
          </span>
        )}
      </div>
    </button>
  );
};

export default LcdTicker;
