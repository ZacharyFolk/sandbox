import PropTypes from 'prop-types';

export const FailScreen = ({ setCurrentScreen, newGame }) => {
  return (
    <div className="cage-fullscreen">
      <h1 className="cage-game-over-title">GAME OVER</h1>

      <button
        className="new-game-button"
        onClick={newGame}
      >
        New Game
      </button>
    </div>
  );
};

FailScreen.propTypes = {
  setCurrentScreen: PropTypes.func.isRequired,
  newGame: PropTypes.func.isRequired,
};
