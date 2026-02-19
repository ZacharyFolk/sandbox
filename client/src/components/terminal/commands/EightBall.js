import { useState, useCallback, useRef } from 'react';

const W = 52;
const bar = '═'.repeat(W);
const p = (s) => `║ ${s.padEnd(W - 2)} ║`;
const HEADER = [
  `╔${bar}╗`,
  p('    ██  MYSTIC ORB — DIVINATION UNIT  ██'),
  p('         FOLK.CODES TERMINAL MK-II'),
  `╠${bar}╣`,
  p(''),
  p('CONCENTRATE ON YOUR QUERY,'),
  p('THEN INVOKE THE ORB.'),
  p(''),
  `╚${bar}╝`,
].join('\n');

const ANSWERS = [
  'AFFIRMATIVE — SIGNAL CONFIRMED.',
  'ALL SYSTEMS POINT TO YES.',
  'THE ORACLE CONCURS.',
  'PROBABILITY: 97.3%. PROCEED.',
  'SENSORS INDICATE: ABSOLUTELY.',
  'COSMIC ALIGNMENT FAVORABLE.',
  'DATA STREAM SAYS: WITHOUT DOUBT.',
  'TRANSMISSION RECEIVED: YES.',
  'THE MAINFRAME HAS SPOKEN. YES.',
  'SIGNAL UNCLEAR — ASK AGAIN.',
  'CANNOT COMPUTE. REPHRASE QUERY.',
  'THE VOID OFFERS NO ANSWER... YET.',
  'DATA INCONCLUSIVE. STAND BY.',
  'NEGATIVE. ALL CHANNELS CONFIRM.',
  'THE STARS SAY: ABSOLUTELY NOT.',
  'PROBABILITY: 2.1%. INADVISABLE.',
  'TRANSMISSION DENIED.',
  'SENSORS DETECT: DOUBTFUL.',
  'THE ORACLE GRIMACES. NO.',
  'DATA ANALYSIS COMPLETE: UNLIKELY.',
  'ERROR 404: FAVORABLE OUTCOME NOT FOUND.',
];

export default function EightBall() {
  const [shaking, setShaking] = useState(false);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const busyRef = useRef(false);

  const shake = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;

    setAnswer('');
    setRevealed(false);
    setShaking(true);

    const chosen = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];

    setTimeout(() => {
      setShaking(false);
      setAnswer('. . .');

      setTimeout(() => {
        setAnswer(chosen);
        setRevealed(true);
        busyRef.current = false;
      }, 1500);
    }, 1200);
  }, []);

  return (
    <div className="eightball-container">
      <pre className="nasa-report eightball-header">{'\n' + HEADER}</pre>

      <pre className={`eightball-ball ${shaking ? 'eightball--shake' : ''}`}>{`
       ██████████████
     ██              ██
   ██    ╔════════╗    ██
  ██     ║  ????  ║     ██
  ██     ║  ????  ║     ██
   ██    ╚════════╝    ██
     ██              ██
       ██████████████`}
      </pre>

      {answer && (
        <div className={`eightball-answer ${revealed ? 'eightball-answer--revealed' : ''}`}>
          {answer}
        </div>
      )}

      <button className="eightball-btn" onClick={shake}>
        {revealed ? '[ SHAKE AGAIN ]' : '[ SHAKE THE ORB ]'}
      </button>
    </div>
  );
}
