import PropTypes from 'prop-types';
import { Eye } from './Eye';

export const CageHead = ({
  hearts,
  timer,
  handleFlipAllCards,
  showPeek,
}) => {
  return (
    <header className="cage-header">
      <div className="cage-logo">CAGE MATCH</div>

      <div className="cage-header-right">
        <div className="cage-score">❤️ {hearts}</div>
        <div className="cage-time">⏱️ {timer}s</div>

        <div className="cage-tools">
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
  timer: PropTypes.number.isRequired,
  handleFlipAllCards: PropTypes.func.isRequired,
  showPeek: PropTypes.bool.isRequired,
};
