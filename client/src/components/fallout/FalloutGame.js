import { useEffect, useRef, useState, useContext } from 'react';
import { TerminalContext } from '../../context/TerminalContext';
import Typist from 'react-typist-component';
import './fallout.css';

// Import sounds
const typeSound = new Audio('/sounds/fallout/type.mp3');
const selectSound = new Audio('/sounds/fallout/select.mp3');
const errorSound = new Audio('/sounds/fallout/error.mp3');
const successSound = new Audio('/sounds/fallout/success.mp3');
const specialSound = new Audio('/sounds/fallout/special.mp3');

// Configure sound volumes
[typeSound, selectSound, errorSound, successSound, specialSound].forEach(sound => {
  sound.volume = 0.3;
});

const MAX_LIVES = 4;
const ROWS = 2 * 17; // Rows in the cypher text
const CHARS_PER_ROW = 12; // Number of characters per row
const CHARS = `!@#$%^&*()-_[]{}<>\\|'";:/?,.`;

// Utility functions
const rnd = (max) => Math.floor(Math.random() * max);

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getChars = (word, nr) => {
  return word.split("").map(text => ({ text, nr }));
};

const getGarble = (length) => {
  return Array(length)
    .fill(0)
    .map(() => ({
      text: CHARS[rnd(CHARS.length)]
    }));
};

const getSpecial = (length, nr) => {
  let open, close;
  const r = Math.random();
  
  if (r < 0.3) {
    open = "[";
    close = "]";
  } else if (r < 0.6) {
    open = "<";
    close = ">";
  } else {
    open = "(";
    close = ")";
  }

  const garble = getGarble(Math.max(length - 2, 1));
  return [{ text: open }, ...garble, { text: close }].map(s => ({
    ...s,
    special: nr
  }));
};

const generateText = (words, length, maxLength) => {
  let output = [];
  let selectedWords = [];
  let wordCount = 0;
  let specialCount = 0;

  words = shuffle(words);
  
  while (output.length < maxLength) {
    let diff = maxLength - output.length;
    let garble = Math.min(diff, rnd(15) + 15 - length);
    output = [...output, ...getGarble(garble)];

    if (Math.random() < 0.3) {
      let specialLength = rnd(6) + 3;
      if (output.length + specialLength < maxLength) {
        output = [...output, ...getSpecial(specialLength, specialCount)];
        specialCount++;
      }
    } else {
      let word = words[wordCount];
      if (output.length + word.length < maxLength) {
        selectedWords = [...selectedWords, word];
        let chars = getChars(word, wordCount);
        output = [...output, ...chars];
        wordCount++;
      }
    }
  }

  const password = selectedWords[rnd(selectedWords.length)];
  return { output, selectedWords, password };
};

const FalloutGame = () => {
  const { enterGameMode, exitGameMode, updateCommand } = useContext(TerminalContext);
  const [gameState, setGameState] = useState('intro'); // intro, playing, success, locked
  const [lives, setLives] = useState(MAX_LIVES);
  const [password, setPassword] = useState('');
  const [selectedWords, setSelectedWords] = useState([]);
  const [cypherText, setCypherText] = useState([]);
  const [activeWord, setActiveWord] = useState(null);
  const [activeElement, setActiveElement] = useState(null);
  const [outputLines, setOutputLines] = useState([]);
  const [hexAddresses, setHexAddresses] = useState([]);
  
  const cypherRef = useRef(null);
  const containerRef = useRef(null);
  const hexCounterRef = useRef(rnd(0xf000) + 0x0c00);

  // Play sound helper
  const playSound = (sound) => {
    try {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } catch (e) {}
  };

  // Enter game mode on mount
  useEffect(() => {
    enterGameMode();
    if (containerRef.current) {
      containerRef.current.focus();
    }
    return () => {
      exitGameMode();
    };
  }, [enterGameMode, exitGameMode]);

  // Load words and initialize game
  useEffect(() => {
    if (gameState === 'playing') {
      initGame();
    }
  }, [gameState]);

  const initGame = async () => {
    try {
      const response = await fetch('/util/words.txt');
      const text = await response.text();
      const words = text.split(' ').filter(w => w.length === 5);

      const wordLength = 5;
      const { output, selectedWords: selected, password: pw } = generateText(
        words, 
        wordLength, 
        ROWS * CHARS_PER_ROW
      );

      setSelectedWords(selected);
      setPassword(pw);
      setCypherText(output);
      setHexAddresses(generateHexAddresses());
      
      // Set first element as active after render
      setTimeout(() => {
        const firstSpan = cypherRef.current?.querySelector('span');
        if (firstSpan) {
          setActiveElement(firstSpan);
          firstSpan.classList.add('active');
        }
      }, 100);
    } catch (error) {
      console.error('Failed to load words:', error);
    }
  };

  // Generate all hex addresses when game starts
  const generateHexAddresses = () => {
    const addresses = [];
    let counter = hexCounterRef.current;
    for (let i = 0; i < ROWS; i++) {
      addresses.push(`0x${counter.toString(16).toUpperCase()}`);
      counter += rnd(6) + 1;
    }
    return addresses;
  };

  // Get active spans (word or special group)
  const getActiveSpans = (el) => {
    if (!el) return [];
    
    const { word, special } = el.dataset;
    if (word) {
      return Array.from(document.querySelectorAll(`[data-word="${word}"]`));
    } else if (special) {
      return Array.from(document.querySelectorAll(`[data-special="${special}"]`));
    }
    return [el];
  };

  // Focus element handler
  const focusElement = (target) => {
    if (!target) return;
    
    playSound(typeSound);
    
    // Remove old active class
    if (activeElement) {
      const oldSpans = getActiveSpans(activeElement);
      oldSpans.forEach(span => span.classList.remove('active'));
    }
    
    // Add new active class
    setActiveElement(target);
    const newSpans = getActiveSpans(target);
    newSpans.forEach(span => span.classList.add('active'));
    
    // Update active word display
    const wordNr = target.dataset.word;
    const activeWordText = newSpans.map(s => s.textContent).join('');
    
    if (!wordNr || wordNr !== activeWord) {
      const activeWordEl = document.querySelector('.active-word');
      if (activeWordEl) {
        activeWordEl.textContent = `> ${activeWordText}`;
      }
    }
    
    setActiveWord(wordNr);
  };

  // Handle mouse hover
  const handleMouseEnter = (e) => {
    focusElement(e.target);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!activeElement || !cypherRef.current) return;
    
    e.preventDefault();
    let nextElement;
    const row = activeElement.parentNode;
    const rows = Array.from(row.parentNode.children);
    const elementIndex = Array.from(row.children).indexOf(activeElement);
    const rowNr = rows.indexOf(row);

    switch (e.keyCode) {
      case 38: // up arrow
        if (rows[rowNr - 1]) {
          nextElement = rows[rowNr - 1].childNodes[elementIndex];
        }
        break;
      case 40: // down arrow
        if (rows[rowNr + 1]) {
          nextElement = rows[rowNr + 1].childNodes[elementIndex];
        }
        break;
      case 37: // left arrow
        if (activeElement.previousElementSibling) {
          nextElement = activeElement.previousElementSibling;
        } else if (rows[rowNr - 17]) {
          const prevRow = rows[rowNr - 17];
          nextElement = prevRow.childNodes[prevRow.childNodes.length - 1];
        }
        break;
      case 39: // right arrow
        // Jump to end of word/special if at start
        if (activeElement.dataset.word) {
          const list = row.querySelectorAll(`[data-word="${activeElement.dataset.word}"]`);
          nextElement = list.item(list.length - 1).nextElementSibling || activeElement.nextElementSibling;
        } else if (activeElement.dataset.special) {
          const list = row.querySelectorAll(`[data-special="${activeElement.dataset.special}"]`);
          nextElement = list.item(list.length - 1).nextElementSibling || activeElement.nextElementSibling;
        } else if (activeElement.nextElementSibling) {
          nextElement = activeElement.nextElementSibling;
        } else if (rows[rowNr + 17]) {
          nextElement = rows[rowNr + 17].childNodes[0];
        }
        break;
      case 13: // enter
        if (activeElement.dataset.word) {
          handlePasswordClick({ target: activeElement });
        } else if (activeElement.dataset.special) {
          handleSpecialClick({ target: activeElement });
        }
        break;
      case 27: // escape
        quitGame(false);
        break;
      default:
        break;
    }

    if (nextElement) {
      focusElement(nextElement);
    }
  };

  // Handle password selection
  const handlePasswordClick = (e) => {
    const target = e.target;
    playSound(selectSound);
    const wordNr = target.dataset.word;
    const pw = selectedWords[parseInt(wordNr)];

    if (pw === password) {
      playSound(successSound);
      quitGame(true);
    } else {
      playSound(errorSound);
      handleError(pw);
    }
  };

  // Handle special bracket selection
  const handleSpecialClick = (e) => {
    const target = e.target;
    playSound(specialSound);
    const special = target.dataset.special;
    const specs = Array.from(document.querySelectorAll(`[data-special="${special}"]`));
    const specialText = specs.map(s => s.textContent).join('');

    let message;
    if (Math.random() < 0.66 || lives === MAX_LIVES) {
      // Remove a dud
      const pwIndex = selectedWords.indexOf(password);
      const duds = Array.from(document.querySelectorAll('[data-word]'))
        .filter(e => e.dataset.word !== String(pwIndex));

      if (duds.length > 0) {
        const dudNr = duds[rnd(duds.length)].dataset.word;
        const dudSpans = Array.from(document.querySelectorAll(`[data-word="${dudNr}"]`));
        
        dudSpans.forEach(span => {
          delete span.dataset.word;
          span.textContent = '.';
        });

        message = `>${specialText}\n>Dud removed.`;
      }
    } else {
      // Reset lives
      setLives(MAX_LIVES);
      message = `>${specialText}\n>Tries reset.`;
    }

    setOutputLines(prev => [...prev, message]);

    // Disable the special
    specs.forEach(s => {
      s.classList.remove('active');
      delete s.dataset.special;
    });
  };

  // Handle error
  const handleError = (pw) => {
    const newLives = lives - 1;
    setLives(newLives);

    if (newLives === 0) {
      quitGame(false);
      return;
    }

    const likeness = pw.split('').reduce(
      (total, c, i) => total + Number(c === password[i]), 
      0
    );

    const message = `>${pw}\n>Entry denied\n>Likeness=${likeness}`;
    setOutputLines(prev => [...prev, message]);
  };

  // Quit game
  const quitGame = (win) => {
    if (win) {
      setGameState('success');
    } else {
      setGameState('locked');
    }
  };

  // Restart game
  const restartGame = () => {
    setLives(MAX_LIVES);
    setPassword('');
    setSelectedWords([]);
    setCypherText([]);
    setActiveElement(null);
    setActiveWord(null);
    setOutputLines([]);
    setHexAddresses([]);
    hexCounterRef.current = rnd(0xf000) + 0x0c00;
    setGameState('playing');
  };

  // Exit to terminal
  const exitGame = () => {
    exitGameMode();
    updateCommand('clear');
  };

  // Render intro
  if (gameState === 'intro') {
    return (
      <div className="fallout-container" ref={containerRef} tabIndex={0}>
        <Typist
          typingDelay={15}
          onTypingDone={() => setGameState('playing')}
        >
          <div className="fallout-intro">
            <p>Welcome to ROBCO Industries (TM) Termlink</p>
            <p>Password Required</p>
          </div>
        </Typist>
      </div>
    );
  }

  // Render locked screen
  if (gameState === 'locked') {
    return (
      <div className="fallout-container locked" ref={containerRef} tabIndex={0}>
        <Typist typingDelay={10}>
          <div className="fallout-locked">
            <p>Terminal locked</p>
            <p>&nbsp;</p>
            <p>Please contact an administrator</p>
          </div>
        </Typist>
        <div className="fallout-exit">
          <button onClick={exitGame} className="fallout-button">
            [Exit terminal]
          </button>
        </div>
      </div>
    );
  }

  // Render success screen
  if (gameState === 'success') {
    return (
      <div className="fallout-container" ref={containerRef} tabIndex={0}>
        <Typist typingDelay={15}>
          <div className="fallout-outro">
            <p>Welcome to ROBCO Industries (TM) Termlink</p>
            <p>"We're in the business of happiness"</p>
            <p>&nbsp;</p>
            <p>&gt; Password accepted</p>
          </div>
        </Typist>
        <div className="fallout-buttons">
          <button onClick={restartGame} className="fallout-button">
            [Restart]
          </button>
          <button onClick={exitGame} className="fallout-button">
            [Exit terminal]
          </button>
        </div>
      </div>
    );
  }

  // Render main game
  return (
    <div 
      className="fallout-container" 
      ref={containerRef} 
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="fallout-header">
        <div className="lives">
          Attempts remaining: {Array(lives).fill('■').join(' ')}
        </div>
        <div className="fallout-hint">Press ESC to exit</div>
      </div>

      <div className="game">
        <div className="cypher" ref={cypherRef}>
          {cypherText.length > 0 && hexAddresses.length > 0 && Array.from({ length: ROWS }).map((_, rowNr) => {
            const startIdx = rowNr * CHARS_PER_ROW;
            const chars = cypherText.slice(startIdx, startIdx + CHARS_PER_ROW);
            
            return (
              <div key={rowNr} className="row">
                <span className="hex-addr">{hexAddresses[rowNr]} </span>
                {chars.map((char, charIdx) => {
                  const spanKey = `${rowNr}-${charIdx}`;
                  const spanProps = {
                    onMouseEnter: handleMouseEnter,
                    onClick: char.nr !== undefined 
                      ? handlePasswordClick 
                      : char.special !== undefined 
                        ? handleSpecialClick 
                        : undefined,
                  };

                  if (char.nr !== undefined) {
                    spanProps['data-word'] = char.nr;
                    spanProps['data-password'] = true;
                  }

                  if (char.special !== undefined) {
                    spanProps['data-special'] = char.special;
                  }

                  return <span key={spanKey} {...spanProps}>{char.text}</span>;
                })}
              </div>
            );
          })}
        </div>

        <div className="output">
          {outputLines.map((line, idx) => (
            <pre key={idx}>{line}</pre>
          ))}
          <div className="active-word"></div>
        </div>
      </div>
    </div>
  );
};

export default FalloutGame;
