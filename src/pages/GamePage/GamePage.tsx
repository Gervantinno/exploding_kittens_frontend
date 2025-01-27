import { useEffect, useState } from 'react';
import { IGameState } from './../../shared/utils/getGameState';
import PlayerCard from './components/PlayerCard/PlayerCard';
import { connectToGame, unsubscribeGame } from '../../shared/api/endpoints';

const GamePage = () => {
  const [gameState, setGameState] = useState<IGameState>();

  useEffect(() => {
    connectToGame('meow', (state) => setGameState(state));

    return () => {
      unsubscribeGame();
    };
  }, []);

  return (
    <div>
      {gameState ? (
        <div>
          {gameState.players.map((player) => (
            <PlayerCard key={player.name} player={player} />
          ))}
          <div>
            <span>DECK:</span>
            <div>
              {gameState.deck.map((card) => (
                <div key={card.name}>{card.name}</div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>sosal</div>
      )}
    </div>
  );
};

export default GamePage;
