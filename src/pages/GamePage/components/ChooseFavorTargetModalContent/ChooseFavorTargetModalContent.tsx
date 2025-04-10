import React from 'react';
import s from '../../GamePage.module.scss';
import { catImages } from '../../../RoomPage/RoomPage';
import { IPlayer } from '../../../../shared/types/player';
import { IGameState } from '../../../../shared/types/gamestate';

interface ChooseFavorTargetModalContentProps {
  opponentsNotLost: IPlayer[];
  handleChooseFavorTarget: (targetPlayerId: string) => void;
  gamestate?: IGameState;
}

const ChooseFavorTargetModalContent: React.FC<ChooseFavorTargetModalContentProps> = ({
  opponentsNotLost,
  handleChooseFavorTarget,
  gamestate,
}) => {
  return (
    <div className={s.modal_content}>
      <h2>Выберите игрока у кого взять карту: </h2>
      <div className={s.img_wrapper}>
        {opponentsNotLost.map((player) => (
          <div key={player.userId} className={s.player_wrapper}>
            <img
              src={catImages[player.index]}
              className={s.icon}
              onClick={() => handleChooseFavorTarget(player.userId)}
            />
            <div className={s.player_name}>
              <span>{player.username}</span>
              <span> Количество карт: {gamestate?.playerHands[player.userId]?.length || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseFavorTargetModalContent;
