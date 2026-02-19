import { useState, useCallback, useRef, useEffect } from 'react';

const ANSWERS = [
  { text: 'AFFIRMATIVE — SIGNAL CONFIRMED.',       sign: 'YES' },
  { text: 'ALL SYSTEMS POINT TO YES.',              sign: 'YES' },
  { text: 'THE ORACLE CONCURS.',                    sign: 'YES' },
  { text: 'PROBABILITY: 97.3%. PROCEED.',           sign: 'YES' },
  { text: 'SENSORS INDICATE: ABSOLUTELY.',           sign: 'YES' },
  { text: 'COSMIC ALIGNMENT FAVORABLE.',             sign: 'YES' },
  { text: 'DATA STREAM SAYS: WITHOUT DOUBT.',        sign: 'YES' },
  { text: 'TRANSMISSION RECEIVED: YES.',             sign: 'YES' },
  { text: 'THE MAINFRAME HAS SPOKEN. YES.',          sign: 'YES' },
  { text: 'SIGNAL UNCLEAR — ASK AGAIN.',             sign: '...' },
  { text: 'CANNOT COMPUTE. REPHRASE QUERY.',         sign: '??'  },
  { text: 'THE VOID OFFERS NO ANSWER... YET.',       sign: '...' },
  { text: 'DATA INCONCLUSIVE. STAND BY.',             sign: '??'  },
  { text: 'NEGATIVE. ALL CHANNELS CONFIRM.',          sign: 'NO'  },
  { text: 'THE STARS SAY: ABSOLUTELY NOT.',           sign: 'NO'  },
  { text: 'PROBABILITY: 2.1%. INADVISABLE.',          sign: 'NO'  },
  { text: 'TRANSMISSION DENIED.',                     sign: 'NO'  },
  { text: 'SENSORS DETECT: DOUBTFUL.',                sign: 'NO'  },
  { text: 'THE ORACLE GRIMACES. NO.',                 sign: 'NO'  },
  { text: 'DATA ANALYSIS COMPLETE: UNLIKELY.',        sign: 'NO'  },
  { text: 'ERROR 404: FAVORABLE OUTCOME NOT FOUND.',  sign: 'NO'  },
];

const IDLE_PROMPTS = [
  'CONCENTRATE ON YOUR QUESTION . . .',
  'FOCUS YOUR MIND . . .',
  'CLEAR YOUR THOUGHTS . . .',
  'LET THE VOID HEAR YOU . . .',
  'HOLD YOUR QUESTION IN YOUR MIND . . .',
  'THE ORACLE AWAITS . . .',
  'OPEN YOUR MIND TO THE COSMOS . . .',
  'BREATHE . . . AND ASK . . .',
  'THE SIGNAL IS LISTENING . . .',
  'TUNE INTO THE FREQUENCY . . .',
];

export default function EightBall() {
  const [shaking, setShaking] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [idleIdx, setIdleIdx] = useState(0);
  const busyRef = useRef(false);

  // Cycle idle prompts when no answer is shown
  const idle = !answer && !shaking;
  useEffect(() => {
    if (!idle) return;
    const id = setInterval(() => {
      setIdleIdx(i => (i + 1) % IDLE_PROMPTS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [idle]);

  const shake = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;

    setAnswer(null);
    setRevealed(false);
    setShaking(true);

    const chosen = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];

    setTimeout(() => {
      setShaking(false);
      setAnswer({ text: '. . .', sign: '...' });

      setTimeout(() => {
        setAnswer(chosen);
        setRevealed(true);
        busyRef.current = false;
      }, 1500);
    }, 1200);
  }, []);

  const signClass = revealed && answer
    ? answer.sign === 'YES' ? 'eightball-sign--yes'
    : answer.sign === 'NO' ? 'eightball-sign--no'
    : 'eightball-sign--maybe'
    : '';

  return (
    <div className="eightball-container">
      <div className="eightball-stars">
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} className="eightball-star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }} />
        ))}
      </div>

      {/* Glowing pyramid tribute behind the orb */}
      <div className="eightball-pyramid" />

      <div className="eightball-title">THE ORACLE</div>
      <div className="eightball-subtitle">DIVINATION ENGINE MK-II</div>

      <div className={`eightball-orb ${shaking ? 'eightball--shake' : ''}`}>
        <div className="eightball-orb-inner">
          <div className={`eightball-triangle ${signClass}`}>
            {revealed && answer ? answer.sign : '?'}
          </div>
        </div>
      </div>

      <div className={`eightball-answer ${revealed ? 'eightball-answer--revealed' : ''}`}>
        {answer
          ? answer.text
          : <span className="eightball-idle">{IDLE_PROMPTS[idleIdx]}</span>
        }
      </div>

      <button className="eightball-btn" onClick={shake}>
        {revealed ? '[ CONSULT AGAIN ]' : '[ CONSULT THE ORB ]'}
      </button>
    </div>
  );
}
