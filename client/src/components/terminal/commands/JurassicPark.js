import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

const ACCESS_SEQUENCE = [
  { prompt: true, text: 'access main program' },
  { prompt: false, text: 'access: PERMISSION DENIED.' },
  { delay: 1200 },
  { prompt: true, text: 'access main security' },
  { prompt: false, text: 'access: PERMISSION DENIED.' },
  { delay: 1200 },
  { prompt: true, text: 'access main program grid' },
  { prompt: false, text: 'access: PERMISSION DENIED.' },
  { delay: 800 },
  { prompt: false, text: '' },
  { prompt: false, text: "access: PERMISSION DENIED....AND...." },
  { delay: 1500 },
];

const MAGIC_WORD = 'YOU DIDN\'T SAY THE MAGIC WORD!';

const CTRL_C_LINES = [
  '',
  '^C',
  '',
  'nice try.',
  '',
  'ah ah ah... you thought that would work?',
  '',
  'this is a UNIX system. I know this.',
  '',
  '    ╔══════════════════════════════════════╗',
  '    ║                                      ║',
  '    ║   SYSTEM OVERRIDE ATTEMPT DETECTED   ║',
  '    ║                                      ║',
  '    ║   USER:  DENNIS NEDRY                ║',
  '    ║   STATUS: TERMINATED                 ║',
  '    ║                                      ║',
  '    ║   "See? Nobody cares."               ║',
  '    ║              -- Dodgson              ║',
  '    ║                                      ║',
  '    ╚══════════════════════════════════════╝',
  '',
  'press ESC to return to terminal...',
];

export default function JurassicPark() {
  const { enterGameMode, exitGameMode } = useContext(TerminalContext);
  const [quit, setQuit] = useState(false);
  const [lines, setLines] = useState([]);
  const [phase, setPhase] = useState('typing'); // typing | spam | ctrlc
  const [showGif, setShowGif] = useState(false);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const spamRef = useRef(null);
  const timeoutsRef = useRef([]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // Access sequence typewriter
  useEffect(() => {
    if (phase !== 'typing') return;

    let delay = 0;
    const PROMPT_CHAR_DELAY = 45;
    const RESPONSE_DELAY = 300;

    ACCESS_SEQUENCE.forEach((step) => {
      if (step.delay) {
        delay += step.delay;
        return;
      }

      if (step.prompt) {
        // Type prompt character by character
        const chars = step.text.split('');
        // Add the prompt marker
        const tPrompt = setTimeout(() => {
          setLines(prev => [...prev, { type: 'prompt', text: '' }]);
          scrollToBottom();
        }, delay);
        timeoutsRef.current.push(tPrompt);
        delay += 200;

        chars.forEach((ch, i) => {
          const t = setTimeout(() => {
            setLines(prev => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              copy[copy.length - 1] = { ...last, text: last.text + ch };
              return copy;
            });
            scrollToBottom();
          }, delay + i * PROMPT_CHAR_DELAY);
          timeoutsRef.current.push(t);
        });
        delay += chars.length * PROMPT_CHAR_DELAY + RESPONSE_DELAY;
      } else {
        const t = setTimeout(() => {
          setLines(prev => [...prev, { type: 'response', text: step.text }]);
          scrollToBottom();
        }, delay);
        timeoutsRef.current.push(t);
        delay += 200;
      }
    });

    // Start spam phase
    const tSpam = setTimeout(() => {
      setPhase('spam');
      setShowGif(true);
    }, delay);
    timeoutsRef.current.push(tSpam);

    return () => timeoutsRef.current.forEach(t => clearTimeout(t));
  }, [phase, scrollToBottom]);

  // Spam phase
  useEffect(() => {
    if (phase !== 'spam') return;

    const addSpam = () => {
      setLines(prev => {
        const batch = [];
        for (let i = 0; i < 3; i++) {
          batch.push({ type: 'spam', text: MAGIC_WORD });
        }
        return [...prev, ...batch];
      });
      scrollToBottom();
    };

    addSpam();
    spamRef.current = setInterval(addSpam, 120);

    return () => clearInterval(spamRef.current);
  }, [phase, scrollToBottom]);

  // Keyboard
  useEffect(() => {
    if (quit) {
      exitGameMode();
      return;
    }
    enterGameMode();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setQuit(true);
        return;
      }
      if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        if (phase === 'ctrlc') return;
        clearInterval(spamRef.current);
        timeoutsRef.current.forEach(t => clearTimeout(t));
        setPhase('ctrlc');
        setShowGif(false);
        setLines(prev => [
          ...prev,
          ...CTRL_C_LINES.map(text => ({ type: 'ctrlc', text })),
        ]);
        setTimeout(scrollToBottom, 50);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearInterval(spamRef.current);
      exitGameMode();
    };
  }, [quit, phase, enterGameMode, exitGameMode, scrollToBottom]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  if (quit) return null;

  return (
    <div ref={containerRef} className="jp-container" tabIndex={0}>
      {showGif && (
        <div className="jp-gif-corner">
          <img src="/images/ah-JP.gif" alt="ah ah ah" className="jp-gif" />
        </div>
      )}
      <div ref={scrollRef} className="jp-scroll">
        <div className="jp-output">
          {lines.map((line, i) => {
            if (line.type === 'prompt') {
              return <div key={i} className="jp-line jp-prompt">{`> ${line.text}`}<span className="jp-cursor">_</span></div>;
            }
            if (line.type === 'spam') {
              return <div key={i} className="jp-line jp-spam">{line.text}</div>;
            }
            if (line.type === 'ctrlc') {
              return <div key={i} className="jp-line jp-ctrlc">{line.text}</div>;
            }
            return <div key={i} className="jp-line jp-response">{line.text}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
