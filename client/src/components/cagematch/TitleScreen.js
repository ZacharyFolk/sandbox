import PropTypes from 'prop-types';
import { LeaderBoard } from './LeaderBoard';

export const TitleScreen = ({ onStart }) => {
  return (
    <div className="cage-title-screen">
      <div className="cage-title-content">
        <h1 className="cage-title">CAGE MATCH</h1>
        
        <LeaderBoard />
        
        <div className="cage-start-button-container">
          <button 
            className="cage-start-button" 
            onClick={onStart}
            autoFocus
          >
            [ START GAME ]
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
