import { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { TerminalContext } from '../../../context/TerminalContext';

const WORDS = [
  'algorithm','backbone','cascade','database','eclipse','firmware','gateway',
  'hologram','integer','javelin','kernel','lattice','mercury','neutron',
  'orbital','phantom','quantum','reactor','silicon','turbine','uplink',
  'voltage','waveform','xenon','yielded','zephyr','binary','cipher',
  'daemon','enigma','fractal','glitch','hacker','invoke','jargon',
  'keylog','lambda','matrix','nexus','opcode','packet','quasar',
  'router','syntax','thread','unlock','vertex','widget','breach',
  'crypto','decode','exfilt','filter','groove','hybrid','inject',
  'jumble','kernel','linked','module','nested','output','parser',
  'render','script','toggle','update','vector','wraith','zeroed',
  'beacon','cortex','dimmer','extern','forked','ground','hosted',
  'inline','jitter','kiosk','latch','malloc','nozzle','offset',
  'pirate','quorum','reboot','socket','turret','unwind','valved',
];

const MAX_WRONG = 7;

const GALLOWS = [
  // 0 wrong
  `
   ┌─────────┐
   │         │
   │
   │
   │
   │
   │
  ─┴─────────`,
  // 1 wrong — head
  `
   ┌─────────┐
   │         │
   │         O
   │
   │
   │
   │
  ─┴─────────`,
  // 2 wrong — body
  `
   ┌─────────┐
   │         │
   │         O
   │         │
   │         │
   │
   │
  ─┴─────────`,
  // 3 wrong — left arm
  `
   ┌─────────┐
   │         │
   │         O
   │        /│
   │         │
   │
   │
  ─┴─────────`,
  // 4 wrong — both arms
  `
   ┌─────────┐
   │         │
   │         O
   │        /│\\
   │         │
   │
   │
  ─┴─────────`,
  // 5 wrong — torso detail
  `
   ┌─────────┐
   │         │
   │         O
   │        /│\\
   │         │
   │        /
   │
  ─┴─────────`,
  // 6 wrong — one leg
  `
   ┌─────────┐
   │         │
   │         O
   │        /│\\
   │         │
   │        / \\
   │
  ─┴─────────`,
  // 7 wrong — dead (both legs + x eyes)
  `
   ┌─────────┐
   │         │
   │        ╳O╳
   │        /│\\
   │         │
   │        / \\
   │
  ─┴─────────`,
];

export default function HangmanGame() {
  const { enterGameMode, exitGameMode } = useContext(TerminalContext);
  const [quit, setQuit] = useState(false);
  const [tick, setTick] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const containerRef = useRef(null);

  const gameRef = useRef(null);
  if (gameRef.current === null) {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    gameRef.current = {
      word,
      guessed: new Set(),
      wrongCount: 0,
      won: false,
      lost: false,
      message: '',
    };
  }

  const resetGame = useCallback(() => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    gameRef.current = {
      word,
      guessed: new Set(),
      wrongCount: 0,
      won: false,
      lost: false,
      message: '',
    };
    setTick(t => t + 1);
  }, []);

  const handleKey = useCallback((key) => {
    const gs = gameRef.current;
    if (gs.won || gs.lost) {
      if (key === 'ENTER') resetGame();
      return;
    }

    if (!/^[A-Z]$/.test(key)) return;
    if (gs.guessed.has(key)) return;

    gs.guessed.add(key);

    if (!gs.word.includes(key)) {
      gs.wrongCount++;
      if (gs.wrongCount >= MAX_WRONG) {
        gs.lost = true;
        gs.message = gs.word;
      }
    } else {
      const allRevealed = gs.word.split('').every(ch => gs.guessed.has(ch));
      if (allRevealed) {
        gs.won = true;
        const msgs = ['DECRYPTED', 'CRACKED', 'DECODED', 'BRILLIANT'];
        gs.message = msgs[Math.floor(Math.random() * msgs.length)];
      }
    }

    setTick(t => t + 1);
  }, [resetGame]);

  useEffect(() => {
    if (quit) {
      exitGameMode();
      return;
    }
    enterGameMode();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (showHelp) { setShowHelp(false); return; }
        setQuit(true);
        return;
      }
      if (e.key === '?' || e.key === 'F1') {
        setShowHelp(h => !h);
        return;
      }
      if (showHelp) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        handleKey('ENTER');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      exitGameMode();
    };
  }, [quit, showHelp, enterGameMode, exitGameMode, handleKey]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  if (quit) return null;

  const gs = gameRef.current;
  const wordDisplay = gs.word.split('').map(ch => gs.guessed.has(ch) || gs.lost ? ch : '_');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div ref={containerRef} className="hangman-container" tabIndex={0}>
      <div className="hangman-title">H A N G M A N</div>

      {gs.message && (
        <div className={`hangman-message ${(gs.won || gs.lost) ? 'hangman-message--final' : ''}`}>
          {gs.won && gs.message}
          {gs.lost && <>THE WORD WAS: <span className="hangman-reveal">{gs.message}</span></>}
          {(gs.won || gs.lost) && <div className="hangman-message-sub">PRESS ENTER TO PLAY AGAIN</div>}
        </div>
      )}

      <pre className={`hangman-gallows ${gs.lost ? 'hangman-gallows--dead' : ''}`}>{GALLOWS[Math.min(gs.wrongCount, MAX_WRONG)]}</pre>

      <div className="hangman-word">
        {wordDisplay.map((ch, i) => (
          <span key={i} className={`hangman-letter ${ch !== '_' ? 'hangman-letter--revealed' : ''} ${gs.lost && !gs.guessed.has(gs.word[i]) ? 'hangman-letter--missed' : ''}`}>
            {ch}
          </span>
        ))}
      </div>

      <div className="hangman-status">
        {!gs.won && !gs.lost && (
          <span className="hangman-remaining">{MAX_WRONG - gs.wrongCount} GUESSES REMAINING</span>
        )}
      </div>

      <div className="hangman-keyboard">
        {alphabet.map((letter) => {
          const used = gs.guessed.has(letter);
          const inWord = gs.word.includes(letter);
          let cls = 'hangman-key';
          if (used && inWord) cls += ' hangman-key--correct';
          else if (used && !inWord) cls += ' hangman-key--wrong';
          return (
            <button
              key={letter}
              className={cls}
              onClick={() => handleKey(letter)}
              disabled={used}
            >
              {letter}
            </button>
          );
        })}
      </div>

      <div className="hangman-hint">? for help &nbsp;&middot;&nbsp; ESC to exit</div>

      {showHelp && (
        <div className="hangman-help-overlay" onClick={() => setShowHelp(false)}>
          <div className="hangman-help-panel new-scroll" onClick={e => e.stopPropagation()}>
            <div className="wordle-help-text">
              <div className="wordle-help-section">HANGMAN</div>
              <div className="wordle-help-rule" />
              <p>Guess the word one letter at a time before the figure is complete.</p>
              <p>Each wrong guess adds a body part. Seven wrong guesses and it's over.</p>

              <div className="wordle-help-section">SIGNAL KEY</div>
              <div className="wordle-help-rule" />
              <div className="wordle-help-labels" style={{ marginTop: 8 }}>
                <span><span className="hangman-key hangman-key--correct hangman-help-swatch">A</span> HIT — letter is in the word</span>
                <span><span className="hangman-key hangman-key--wrong hangman-help-swatch">X</span> MISS — letter is not in the word</span>
              </div>

              <div className="wordle-help-section">CONTROLS</div>
              <div className="wordle-help-rule" />
              <div className="wordle-help-controls">
                <span>A-Z ............. guess a letter</span>
                <span>Enter ........... new game (after win/loss)</span>
                <span>? or F1 ......... toggle this help</span>
                <span>Esc ............. exit to terminal</span>
              </div>
            </div>
            <button className="wordle-help-close" onClick={() => setShowHelp(false)}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}
