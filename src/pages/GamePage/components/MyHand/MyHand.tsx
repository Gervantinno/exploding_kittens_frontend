import React, { useState } from 'react';
import { catCards } from '../../GamePage';
import s from './MyHand.module.scss';

import PlayerCard, { cardImages } from '../PlayerCard/PlayerCard';
import Modal from '../../../../shared/components/Modal/Modal';

export type MyHandProps = {
  hand: string[];
  isCurrentTurn: boolean;
  handlePlayCard: (card: string) => void;
  playCombo: (selectedCardType: string) => void;
  selectedCard?: string;
  numberOfCards: number;
  resetSelection: () => void;
  handleSelectCard: (card: string, index: number) => void;
  selectedIndexes: number[];
};

const MyHand: React.FC<MyHandProps> = ({
  hand,
  isCurrentTurn,
  handlePlayCard,
  playCombo,
  selectedCard,
  numberOfCards,
  resetSelection,
  handleSelectCard,
  selectedIndexes,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openedCard, setOpenedCard] = useState('');
  const [openedIndex, setOpenedIndex] = useState(-1);

  const toggleVisibility = (card: string, index: number) => {
    setOpenedCard(card);
    setIsOpen((prevIsOpen) => !prevIsOpen);
    setOpenedIndex(index);
  };

  const close = () => {
    setOpenedCard('');
    setIsOpen(false);
    setOpenedIndex(-1);
  };

  const isCat = catCards.includes(openedCard);
  const isDefuse = openedCard === 'defuse';

  return (
    <>
      {selectedCard && (
        <div className={s.combo_action_wrapper}>
          <button onClick={resetSelection}>Сбросить выбор</button>
          {numberOfCards > 1 && numberOfCards < 3 && (
            <button onClick={() => playCombo(selectedCard)}>Применить комбинацию</button>
          )}
        </div>
      )}
      <div className={s.cards_wrapper}>
        {hand.map((card: string, index) => {
          const isDisabled =
            !!selectedCard && (card !== selectedCard || selectedIndexes?.includes(index));
          return (
            <div key={index}>
              <PlayerCard
                card={card}
                onClick={() => toggleVisibility(card, index)}
                disabled={isDisabled}
              />
            </div>
          );
        })}
      </div>

      <Modal isOpen={isOpen} toggleVisibility={() => toggleVisibility('', -1)}>
        <div className={s.wrapper}>
          <img src={cardImages[openedCard] || ''} className={s.image_large} />
          <div className={s.card_action_wrapper}>
            {isCurrentTurn && !isCat && !isDefuse && (
              <button
                onClick={() => {
                  handlePlayCard(openedCard);
                  close();
                }}
              >
                Использовать
              </button>
            )}
            {isCurrentTurn && (
              <button
                onClick={() => {
                  handleSelectCard(openedCard, openedIndex);
                  close();
                }}
              >
                Выбрать
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MyHand;
