import React from 'react';
import s from '../../GamePage.module.scss';
import { cardImages } from '../../components/PlayerCard/PlayerCard';

interface GiveFavorCardModalContentProps {
  hand: string[];
  toPlayerUsername: string | undefined;
  handleGiveFavorCard: (card: string, toUserId: string) => void;
  toUserId: string;
}

const GiveFavorCardModalContent: React.FC<GiveFavorCardModalContentProps> = ({
  hand,
  toPlayerUsername,
  handleGiveFavorCard,
  toUserId,
}) => {
  return (
    <div className={s.modal_content}>
      <h2>{toPlayerUsername} запрашивает карту, выберите какую карту дать:</h2>
      <div className={s.img_wrapper}>
        {hand.map((card, index) => (
          <img
            key={index}
            src={cardImages[card] || ''}
            className={s.card_image}
            onClick={() => handleGiveFavorCard(card, toUserId)}
            alt={`Give ${card}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GiveFavorCardModalContent;
