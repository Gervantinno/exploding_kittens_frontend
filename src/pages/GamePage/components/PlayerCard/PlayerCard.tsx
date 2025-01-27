import React from 'react';
import styles from './PlayerCard.module.scss';
import { IPlayer } from '../../../../shared/utils/getGameState';
import socket from '../../../../shared/api/socket';

interface PlayerCardProps {
  player: IPlayer;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  return (
    <div>
      <span>{player.name}</span>
      <div>
        {player.cards.map((card, index) => (
          <div
            key={player.name + card.name + index}
            onClick={() => socket.emit('play-card', { player: player.name, card: card.name })}
            className={styles['card']}
          >
            {card.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerCard;
