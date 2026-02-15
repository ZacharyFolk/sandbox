import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const CageCard = ({
  card,
  onCardClick,
  isDisabled,
  resetKey,
  flipAllCards,
  isSelected,
  isFrozen,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!isFlipped && !isDisabled && !flipAllCards) {
      setIsFlipped(true);
      onCardClick(card);
    }
  };

  useEffect(() => {
    if (!card.isMatched && isFlipped && isDisabled && !flipAllCards && !isFrozen) {
      setTimeout(() => {
        setIsFlipped(false);
      }, 1000);
    }
  }, [card.isMatched, isFlipped, isDisabled, flipAllCards, isFrozen]);

  useEffect(() => {
    if (card.isMatched) {
      setIsFlipped(true);
    }
  }, [card.isMatched]);

  useEffect(() => {
    setIsFlipped(false);
  }, [resetKey]);

  return (
    <img
      src={
        card.isMatched
          ? '/images/cagematch/caged.jpg'
          : flipAllCards || isFlipped
          ? card.img
          : '/images/cagematch/cage10.jpg'
      }
      alt={card.name}
      onClick={handleClick}
      className={`cage-card ${isSelected ? 'selected' : ''} ${card.isMatched ? 'matched' : ''}`}
    />
  );
};

CageCard.propTypes = {
  card: PropTypes.shape({
    name: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    isMatched: PropTypes.bool,
  }).isRequired,
  onCardClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  resetKey: PropTypes.number.isRequired,
  flipAllCards: PropTypes.bool,
  isSelected: PropTypes.bool,
  isFrozen: PropTypes.bool,
};
