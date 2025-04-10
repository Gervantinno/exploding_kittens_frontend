import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../../shared/api/socket';
import { getAuthInfo } from '../../shared/api/auth';

const auth = getAuthInfo();
const userId = auth?.userId;

const catCards = ['taco_cat', 'hairy_potato_cat'];

const cardTypes = [
  'attack',
  'skip',
  'favor',
  'shuffle',
  'see_the_future',
  'defuse',
  'taco_cat',
  'hairy_potato_cat',
  'bomb',
];

const GamePage = () => {
  const { roomId } = useParams();
  const [players, setPlayers] = useState<{ userId: string; username: string }[]>([]);
  const [currentTurn, setCurrentTurn] = useState('');
  const [lastAction, setLastAction] = useState('');
  const [hand, setHand] = useState<string[]>([]);
  const [futureCards, setFutureCards] = useState<string[]>([]);
  const [favorRequest, setFavorRequest] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [showCardChoices, setShowCardChoices] = useState(false);
  const [targetPlayerId, setTargetPlayerId] = useState<string | null>(null);
  const [winner, setWinner] = useState<{ userId: string; username: string } | null>(null);

  useEffect(() => {
    if (roomId) socket.emit('joinRoom', roomId);

    socket.on('gameState', (game) => {
      setPlayers(game.players);
      setCurrentTurn(game.currentTurn);
      setHand(game.playerHands[userId] || []);
    });

    socket.on('cardEffect', ({ player, effect }) => {
      setLastAction(`${player}: ${effect}`);
    });

    socket.on('seeFuture', (cards) => {
      setFutureCards(cards);
    });

    socket.on('requestFavor', (player) => {
      setFavorRequest(player);
    });

    socket.on('gameOver', (data) => {
      setWinner(data.winner);
    });

    return () => {
      socket.off('gameState');
      socket.off('cardEffect');
      socket.off('seeFuture');
      socket.off('requestFavor');
      socket.off('gameOver');
    };
  }, [roomId]);

  const handleDrawCard = () => {
    socket.emit('drawCard', roomId);
    resetSelections();
  };

  const handleGiveCard = (card: string) => {
    if (favorRequest) {
      socket.emit('giveCard', { roomId, fromPlayer: userId, toPlayer: favorRequest, card });
      setFavorRequest(null);
    }
  };

  const handlePlayCard = (card: string) => {
    const isCat = catCards.includes(card);
    const isDefuse = card === 'defuse';
    if (!isCat && !isDefuse) {
      socket.emit('playCard', { roomId, card });
      resetSelections();
    }
  };

  const handleSelectCat = (card: string) => {
    const newSelected = [...selectedCats, card];
    setSelectedCats(newSelected);
  };

  const handleChooseTarget = (targetId: string) => {
    const count = selectedCats.length;
    if (count === 2) {
      socket.emit('playCombo', { roomId, cards: selectedCats, targetPlayerId: targetId });
      resetSelections();
    } else if (count === 3) {
      setTargetPlayerId(targetId);
      setShowCardChoices(true);
    }
  };

  const handlePickDesiredCard = (desired: string) => {
    socket.emit('playCombo', {
      roomId,
      cards: selectedCats,
      targetPlayerId,
      desiredCard: desired,
    });
    resetSelections();
  };

  const handleRestart = () => {
    socket.emit('restartGame', roomId);
    setWinner(null);
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedCats([]);
    setTargetPlayerId(null);
    setShowCardChoices(false);
  };

  const selectedType = selectedCats[0];
  const isValidCombo =
    selectedCats.length >= 2 &&
    selectedCats.length <= 3 &&
    selectedCats.every((c) => c === selectedType);

  return (
    <div>
      <h1>Game in Room {roomId}</h1>
      <h2>Players:</h2>
      <ul>
        {players.map((player) => (
          <li
            key={player.userId}
            style={{ fontWeight: player.userId === currentTurn ? 'bold' : 'normal' }}
          >
            {player.username}
            {player.userId === userId ? ' (You)' : ''}
            {player.userId === currentTurn ? ' (Your Turn)' : ''}

            {isValidCombo && player.userId !== userId && (
              <button onClick={() => handleChooseTarget(player.userId)}>Target</button>
            )}
          </li>
        ))}
      </ul>

      <h2>Your Hand:</h2>
      <ul>
        {hand.map((card, index) => {
          const isCat = catCards.includes(card);
          const isDefuse = card === 'defuse';
          const countSelected = selectedCats.filter((c) => c === card).length;
          const maxSelectable = hand.filter((c) => c === card).length;

          return (
            <li key={index}>
              {card}{' '}
              {favorRequest ? (
                <button onClick={() => handleGiveCard(card)}>Give</button>
              ) : !isCat && !isDefuse ? (
                <button onClick={() => handlePlayCard(card)}>Play</button>
              ) : countSelected < maxSelectable ? (
                <button onClick={() => handleSelectCat(card)}>Select</button>
              ) : null}
            </li>
          );
        })}
      </ul>

      <button onClick={handleDrawCard} disabled={userId !== currentTurn}>
        Draw Card
      </button>

      {futureCards.length > 0 && <p>Top 3 cards: {futureCards.join(', ')}</p>}

      {favorRequest && (
        <p>
          {players.find((p) => p.userId === favorRequest)?.username || favorRequest} requested a
          card!
        </p>
      )}

      {lastAction && <p>Last action: {lastAction}</p>}

      {showCardChoices && (
        <div>
          <h3>Select a card to steal:</h3>
          {cardTypes.map((type) => (
            <button key={type} onClick={() => handlePickDesiredCard(type)}>
              {type}
            </button>
          ))}
        </div>
      )}

      {winner && (
        <div style={{ border: '2px solid green', marginTop: '20px', padding: '15px' }}>
          <h2>🎉 Game Over!</h2>
          <h3>🏆 Winner: {winner.username}</h3>
          <button onClick={handleRestart}>Start Again</button>
        </div>
      )}
    </div>
  );
};

export default GamePage;
