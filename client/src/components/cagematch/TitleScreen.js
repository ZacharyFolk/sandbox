import { useState } from 'react';
import PropTypes from 'prop-types';
import { LeaderBoard } from './LeaderBoard';

export const TitleScreen = ({ onStart }) => {
  const [showScores, setShowScores] = useState(false);

  return (
    <div className="cage-title-screen">
      <h1 className="cage-title">CAGE MATCH</h1>

      <div className="cage-title-content">
        {showScores && <LeaderBoard />}

        <div className="cage-start-button-container">
          <button
            className="cage-start-button"
            onClick={onStart}
            autoFocus
          >
            [ START GAME ]
          </button>
          <button
            className="cage-start-button"
            onClick={() => setShowScores((s) => !s)}
          >
            {showScores ? '[ HIDE SCORES ]' : '[ HIGH SCORES ]'}
          </button>
          <p className="cage-hint">Press ESC anytime to exit</p>
        </div>
      </div>
    </div>
  );
};

TitleScreen.propTypes = {
  onStart: PropTypes.func.isRequired,
};
