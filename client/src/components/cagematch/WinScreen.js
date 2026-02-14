import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { writeNewScore } from './utils';

const AlphabetSelector = ({ initials, onSelect }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const handlePrev = (index) => {
    const letterIndex = alphabet.indexOf(initials[index]);
    const newLetterIndex =
      letterIndex === 0 ? alphabet.length - 1 : letterIndex - 1;
    onSelect(index, alphabet[newLetterIndex]);
  };

  const handleNext = (index) => {
    const letterIndex = alphabet.indexOf(initials[index]);
    const newLetterIndex =
      letterIndex === alphabet.length - 1 ? 0 : letterIndex + 1;
    onSelect(index, alphabet[newLetterIndex]);
  };
  
  return (
    <div className="letter-pickers">
      {initials.map((initial, index) => (
        <div key={index} className="letter">
          <button onClick={() => handlePrev(index)}>▲ </button>
          <span>{initial}</span>
          <button onClick={() => handleNext(index)}>▼</button>
        </div>
      ))}
    </div>
  );
};

AlphabetSelector.propTypes = {
  initials: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export const WinScreen = ({
  setCurrentScreen,
  fullDeck,
  newHigh,
  time,
  hearts,
  newGame,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [intervalDuration, setIntervalDuration] = useState(1000);
  const [initials, setInitials] = useState(['A', 'A', 'A']);

  const FinalWords = newHigh ? 'HIGH SCORE' : 'YOU WIN!';

  const handleSelect = (index, letter) => {
    const newInitials = [...initials];
    newInitials[index] = letter;
    setInitials(newInitials);
  };

  const submitScore = async () => {
    const winner = initials.join('');
    const responseMessage = await writeNewScore(winner, time, hearts);
    console.log(responseMessage);
    newGame();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % fullDeck.length);
      const newIntervalDuration = Math.max(50, intervalDuration * 0.95);
      setIntervalDuration(newIntervalDuration);
    }, intervalDuration);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [fullDeck, intervalDuration]);

  return (
    <div className="cage-fullscreen">
      <h1 className="cage-win-title">{FinalWords}</h1>

      <img
        className="cage-win-image"
        src={fullDeck[currentImageIndex].img}
        alt="Card"
      />

      {newHigh ? (
        <div className="high-score-form">
          <p>
            Congratulations! <br />
            Enter your initials for a position in the top ten.
          </p>
          <AlphabetSelector initials={initials} onSelect={handleSelect} />
          <button onClick={submitScore}>ENTER</button>
        </div>
      ) : (
        <button onClick={newGame}>
          New Game
        </button>
      )}
    </div>
  );
};

WinScreen.propTypes = {
  setCurrentScreen: PropTypes.func.isRequired,
  fullDeck: PropTypes.array.isRequired,
  newHigh: PropTypes.bool.isRequired,
  time: PropTypes.number.isRequired,
  hearts: PropTypes.number.isRequired,
  newGame: PropTypes.func.isRequired,
};
