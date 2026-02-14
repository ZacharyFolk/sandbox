import PropTypes from 'prop-types';
import { CageCard } from './CageCard';

export const GameScreen = ({
  cardsDealt,
  handleCardClick,
  isDisabled,
  selectedCards,
  resetKey,
  flipAllCards,
  frozenCards,
}) => {
  return (
    <div className="cage-grid new-scroll">
      {cardsDealt.map((card) => (
        <CageCard
          key={card.id}
          card={card}
          onCardClick={handleCardClick}
          isDisabled={isDisabled || selectedCards.length >= 2}
          resetKey={resetKey}
          flipAllCards={flipAllCards}
          // Compare by ID so only the clicked card highlights, not its pair
          isSelected={selectedCards.some((c) => c.id === card.id)}
          // frozenCards holds IDs to block flip-back during the modal
          isFrozen={frozenCards.includes(card.id)}
        />
      ))}
    </div>
  );
};

GameScreen.propTypes = {
  cardsDealt: PropTypes.array.isRequired,
  handleCardClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  selectedCards: PropTypes.array.isRequired,
  resetKey: PropTypes.number.isRequired,
  flipAllCards: PropTypes.bool.isRequired,
  frozenCards: PropTypes.array,
};
