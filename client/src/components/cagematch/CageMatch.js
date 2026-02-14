import { useEffect, useState, useRef, useContext } from 'react';
import { TerminalContext } from '../../context/TerminalContext';
import './cagematch.css';
import { cardArray } from './cardArray';
import { TitleScreen } from './TitleScreen';
import { GameScreen } from './GameScreen';
import { CageHead } from './CageHead';
import { WinScreen } from './WinScreen';
import { FailScreen } from './FailScreen';
import { checkIfScoreIsBetter } from './utils';

const dealSpeed = 100;

const dealSound = new Audio('/sounds/cagematch/deal.wav');
const missSound = new Audio('/sounds/cagematch/hit-01.wav');
const flipSound = new Audio('/sounds/cagematch/flip.wav');
const matchSound = new Audio('/sounds/cagematch/collect-point-01.wav');
const shame = new Audio('/sounds/cagematch/shame-on-you.mp3');
const thanks = new Audio('/sounds/cagematch/cage-thanks.mp3');
const bored = new Audio('/sounds/cagematch/cage-bored.mp3');
const bunny = new Audio('/sounds/cagematch/cage-bunny.mp3');
const through = new Audio('/sounds/cagematch/am-i-getting-through-to-you.mp3');
const declaration = new Audio('/sounds/cagematch/cage-declaration.mp3');

const clipArray = [through, bored, bunny, declaration];
const getRandomSound = () => clipArray[Math.floor(Math.random() * clipArray.length)];

const CageMatch = () => {
  const { enterGameMode, exitGameMode, updateCommand } = useContext(TerminalContext);

  const maxLives = 10;
  const [muted, setMuted] = useState(false);
  const [cardsDealt, setCardsDealt] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [fullDeck, setFullDeck] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [hearts, setHearts] = useState(maxLives);
  const [timer, setTimer] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [matchedCards, setMatchedCards] = useState([]);
  // resetKey increments each new game so CageCard's useEffect always fires on reset
  const [resetKey, setResetKey] = useState(0);
  const [newHigh, setNewHigh] = useState(false);
  const [audioElements, setAudioElements] = useState([]);
  const [flipAllCards, setFlipAllCards] = useState(false);
  const [newStreak, setNewStreak] = useState(false);
  const [showPeek, setShowPeek] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('title');
  const [showModal, setShowModal] = useState(false);
  const [modalCards, setModalCards] = useState([]);
  const [isMatch, setIsMatch] = useState(null);
  const [modalFadingOut, setModalFadingOut] = useState(false);
  // frozenCards stores card IDs — prevents the flip-back animation while modal is open
  const [frozenCards, setFrozenCards] = useState([]);

  // Refs let the matching effect read current values without them being dependencies,
  // which would otherwise re-trigger the effect mid-flight and cause double-counting.
  const mutedRef = useRef(muted);
  const cardsDealtRef = useRef(cardsDealt);
  const consecutiveMatchesRef = useRef(0);

  useEffect(() => { mutedRef.current = muted; }, [muted]);
  useEffect(() => { cardsDealtRef.current = cardsDealt; }, [cardsDealt]);

  // Dev cheat: window.cagematchWin() skips straight to the win/scoring screen
  useEffect(() => {
    window.cagematchWin = () => YouWin();
    return () => { delete window.cagematchWin; };
  }); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    enterGameMode();
    return () => exitGameMode();
  }, [enterGameMode, exitGameMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        exitGameMode();
        updateCommand('clear');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [exitGameMode, updateCommand]);

  const handleFlipAllCards = () => {
    setFlipAllCards(true);
    setTimeout(() => setFlipAllCards(false), 2000);
    setShowPeek(false);
  };

  useEffect(() => {
    if (isGameRunning) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isGameRunning]);

  // Uses mutedRef so callers inside timeouts always get the current mute state.
  const playSound = (audio) => {
    if (!mutedRef.current) {
      audio.currentTime = 0;
      audio.volume = 0.2;
      audio.play().catch(() => {});
      setAudioElements((prev) => [...prev, { audio, isPlaying: true }]);
    }
  };

  const handleCardClick = (clickedCard) => {
    playSound(flipSound);
    if (selectedCards.length < 2 && !clickedCard.isMatched) {
      setSelectedCards((prev) => [...prev, clickedCard]);
    }
  };

  useEffect(() => {
    if (hearts === 0) {
      gameOver();
    } else if (hearts === 2) {
      playSound(getRandomSound());
    }
  }, [hearts]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (matchedCards.length > 0 && matchedCards.length === fullDeck.length) {
      setIsGameRunning(false);
      YouWin();
    }
  }, [matchedCards, fullDeck]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Core matching logic ──────────────────────────────────────────────────
  // Depends ONLY on selectedCards. All other values are read from refs to
  // prevent the effect from firing a second time when state updates mid-flight.
  useEffect(() => {
    if (selectedCards.length !== 2) return;

    setIsDisabled(true);
    const [card1, card2] = selectedCards;

    // Freeze both cards by ID so they don't flip back while the modal is open
    setFrozenCards([card1.id, card2.id]);
    setModalCards([card1, card2]);
    setShowModal(true);

    // Reveal match/no-match result after a brief dramatic pause
    const revealTimer = setTimeout(() => {
      const matched = card1.name === card2.name;
      setIsMatch(matched);
      playSound(matched ? matchSound : missSound);
    }, 400);

    // Resolve the round after the modal has been visible for a moment
    const resolveTimer = setTimeout(() => {
      setModalFadingOut(true);

      const matched = card1.name === card2.name;

      if (matched) {
        // Mark both cards as matched in the deck using their unique IDs
        setCardsDealt(
          cardsDealtRef.current.map((card) =>
            card.id === card1.id || card.id === card2.id
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatchedCards((prev) => [...prev, card1, card2]);
        setHearts((z) => (z === maxLives ? z : z + 1));

        consecutiveMatchesRef.current += 1;
        if (consecutiveMatchesRef.current >= 3) {
          setShowPeek(true);
          setNewStreak(true);
          consecutiveMatchesRef.current = 0;
          setTimeout(() => setNewStreak(false), 3000);
        }
      } else {
        setHearts((z) => z - 1);
        consecutiveMatchesRef.current = 0;
      }

      // Clean up modal and re-enable input
      setTimeout(() => {
        setShowModal(false);
        setModalFadingOut(false);
        setIsMatch(null);
        setModalCards([]);
        setFrozenCards([]);
        setSelectedCards([]);
        setIsDisabled(false);
      }, 450);
    }, 2500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(resolveTimer);
    };
  }, [selectedCards]); // eslint-disable-line react-hooks/exhaustive-deps

  const dealCards = () => {
    // Spread creates two copies of each card object — they share the same reference.
    // Adding a unique id to each position gives every card a distinct identity,
    // fixing incorrect selection highlighting of the matching pair.
    const shuffledArray = [...cardArray, ...cardArray]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));

    setFullDeck(shuffledArray);

    const dealInterval = setInterval(() => {
      setCardsDealt((prev) => {
        playSound(dealSound);
        if (prev.length === shuffledArray.length) {
          clearInterval(dealInterval);
          setIsDisabled(false);
          setIsGameRunning(true);
          return prev;
        }
        return [...prev, shuffledArray[prev.length]];
      });
    }, dealSpeed);

    return () => clearInterval(dealInterval);
  };

  const startNewGame = () => {
    setIsDisabled(true);
    setCardsDealt([]);
    setMatchedCards([]);
    setSelectedCards([]);
    setHearts(maxLives);
    setTotalTime(0);
    setTimer(0);
    setShowPeek(false);
    setNewHigh(false);
    setCurrentScreen('game');
    consecutiveMatchesRef.current = 0;
    // Increment resetKey so CageCard's flip-reset effect always fires
    setResetKey((k) => k + 1);
    dealCards();
  };

  const YouWin = async () => {
    setIsGameRunning(false);
    playSound(thanks);
    // Compute finalTime synchronously — setTotalTime is async so reading totalTime
    // on the next line would give the stale pre-update value.
    const finalTime = typeof window.cagematchCheat === 'number' ? window.cagematchCheat : totalTime + timer;
    setTotalTime(finalTime);
    setCurrentScreen('win');
    const qualifiesAsHighScore = await checkIfScoreIsBetter(finalTime, hearts);
    if (qualifiesAsHighScore) {
      setNewHigh(true);
    }
  };

  const gameOver = () => {
    setCurrentScreen('lose');
    setTotalTime((prev) => prev + timer);
    setIsGameRunning(false);
    playSound(shame);
  };

  return (
    <div className="cagematch-container">
      {newStreak && (
        <div className="streak-container">
          <div className="streak">
            <h1>🔥 YOU ARE ON FIRE 🔥</h1>
            <p>You unlocked a peek!</p>
          </div>
        </div>
      )}

      {currentScreen === 'title' && <TitleScreen onStart={startNewGame} />}

      {currentScreen !== 'title' && (
        <CageHead
          hearts={hearts}
          muted={muted}
          setMuted={setMuted}
          timer={timer}
          audioElements={audioElements}
          handleFlipAllCards={handleFlipAllCards}
          showPeek={showPeek}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen
          cardsDealt={cardsDealt}
          handleCardClick={handleCardClick}
          isDisabled={isDisabled}
          selectedCards={selectedCards}
          resetKey={resetKey}
          flipAllCards={flipAllCards}
          frozenCards={frozenCards}
        />
      )}

      {currentScreen === 'win' && (
        <WinScreen
          fullDeck={fullDeck}
          newHigh={newHigh}
          time={totalTime}
          hearts={hearts}
          newGame={startNewGame}
        />
      )}

      {currentScreen === 'lose' && (
        <FailScreen setCurrentScreen={setCurrentScreen} newGame={startNewGame} />
      )}

      <div className="cagematch-exit-hint">Press ESC to exit</div>

      {showModal && (
        <div className={`card-modal ${modalFadingOut ? 'fade-out' : ''}`}>
          <div className="modal-cards">
            {modalCards.map((card, index) => (
              <img
                key={index}
                src={card.img}
                alt={card.name}
                className={`modal-card ${
                  isMatch !== null ? (isMatch ? 'match' : 'no-match') : ''
                }`}
              />
            ))}
          </div>
          {isMatch !== null && (
            <div className={`modal-text ${isMatch ? 'match' : 'no-match'}`}>
              {isMatch ? 'MATCH!' : 'NO MATCH'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CageMatch;
