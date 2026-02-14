import PropTypes from 'prop-types';
import { SoundOnIcon } from './SoundOnIcon';
import { SoundOffIcon } from './SoundOffIcon';
import { Eye } from './Eye';

export const CageHead = ({
  hearts,
  muted,
  setMuted,
  timer,
  audioElements,
  handleFlipAllCards,
  showPeek,
}) => {
  const toggleMute = () => {
    const newMuted = !muted;

    audioElements.forEach(({ audio, isPlaying }) => {
      audio.muted = newMuted;
      if (newMuted && isPlaying) {
        audio.pause();
      }
    });
    setMuted(newMuted);
  };

  return (
    <header className="cage-header">
      <div className="cage-logo">CAGE MATCH</div>
      
      <div className="cage-header-right">
        <div className="cage-score">❤️ {hearts}</div>
        <div className="cage-time">⏱️ {timer}s</div>
        
        <div className="cage-tools">
          <div className="cage-volume" onClick={toggleMute}>
            {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          </div>
          
          {showPeek && (
            <div className="cage-eye" onClick={handleFlipAllCards}>
              <Eye />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

CageHead.propTypes = {
  hearts: PropTypes.number.isRequired,
  muted: PropTypes.bool.isRequired,
  setMuted: PropTypes.func.isRequired,
  timer: PropTypes.number.isRequired,
  audioElements: PropTypes.array.isRequired,
  handleFlipAllCards: PropTypes.func.isRequired,
  showPeek: PropTypes.bool.isRequired,
};
