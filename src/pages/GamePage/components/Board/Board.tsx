import React from 'react';
import s from './Board.module.scss';
import { IPlayer } from '../../../../shared/types/player';
import { IGameState } from '../../../../shared/types/gamestate';
import { catImages } from '../../../RoomPage/RoomPage';
import dead_cat from '../../../../shared/img/cats/dead_cat.png';
import { getUserId } from '../../../../shared/utils/userId';
import explode_effect from '../../../../shared/img/effects/explode_effect.png';
import defuse_effect from '../../../../shared/img/effects/happy_cat.png';
import back_card from '../../../../shared/img/cards/back.png';
import MyHand, { MyHandProps } from '../MyHand/MyHand';

type BoardProps = MyHandProps & {
  opponents: IPlayer[];
  gamestate?: IGameState;
  isExplodeEffect: boolean;
  handleDrawCard: () => void;
  currentPlayer?: IPlayer;
  isDefuseEffect: boolean;
};

const Board: React.FC<BoardProps> = ({
  opponents,
  gamestate,
  isExplodeEffect,
  handleDrawCard,
  currentPlayer,
  handlePlayCard,
  playCombo,
  hand,
  isCurrentTurn,
  selectedCard,
  numberOfCards,
  resetSelection,
  handleSelectCard,
  selectedIndexes,
  isDefuseEffect,
}) => {
  const userId = getUserId();

  return (
    <div className={s.board_wrapper}>
      <div className={s.opponents_wrapper}>
        {opponents.map((player) => (
          <div
            key={player.userId}
            className={`${s.player} ${player.userId === gamestate?.currentTurn ? s.current_turn : ''}`}
          >
            {player.hasLost ? (
              <img src={dead_cat} />
            ) : (
              <img src={catImages[player.index]} alt={player.username} />
            )}
            <div className={s.player_name}>
              <span>{player.username}</span>
              <span> Количество карт: {gamestate?.playerHands[player.userId]?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={s.deck_card_wrapper}>
        <span className={s.your_turn_label}>
          {gamestate?.currentTurn === userId
            ? `Ваш ход\n${gamestate?.cardsToDraw !== 1 ? `Вы должны взять ${gamestate?.cardsToDraw} карты` : ''}`
            : `Ходит: ${gamestate?.players.find((p) => p.userId === gamestate?.currentTurn)?.username}`}
        </span>
        {isExplodeEffect && <img src={explode_effect} className={s.explode_effect} />}
        {isDefuseEffect && <img src={defuse_effect} className={s.defuse_effect} />}
        <img
          src={back_card}
          onClick={handleDrawCard}
          className={`${s.deck_card} ${gamestate?.currentTurn !== userId ? s.disabled : s.pointer}`}
          alt="Deck"
        />
      </div>

      <div className={s.player_wrapper}>
        {currentPlayer?.hasLost ? (
          <h2>Вы проиграли!</h2>
        ) : (
          <MyHand
            hand={hand}
            isCurrentTurn={isCurrentTurn}
            handlePlayCard={handlePlayCard}
            playCombo={playCombo}
            selectedCard={selectedCard}
            numberOfCards={numberOfCards}
            resetSelection={resetSelection}
            handleSelectCard={handleSelectCard}
            selectedIndexes={selectedIndexes}
          />
        )}
      </div>
    </div>
  );
};

export default Board;
