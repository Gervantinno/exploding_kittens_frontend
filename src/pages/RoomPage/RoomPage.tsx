import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../shared/api/socket';

export interface Player {
  userId: string;
  username: string;
}

export interface Room {
  id: string;
  name: string;
  players: Player[];
  gameStarted: boolean;
}

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!roomId) return;

    socket.emit('joinRoom', roomId);
    socket.on('roomUpdated', (room: Room) => setRoom(room));
    socket.on('gameStarted', () => navigate(`/game/${roomId}`));

    // ✅ Обработка ошибки входа
    socket.on('joinFailed', ({ reason }: { reason: string }) => {
      alert(reason); // Можно заменить на модалку или toast
      navigate('/rooms');
    });

    return () => {
      socket.emit('leaveRoom', { roomId });
      socket.off('roomUpdated');
      socket.off('gameStarted');
      socket.off('joinFailed');
    };
  }, [roomId]);

  const handleLeave = () => {
    socket.emit('leaveRoom', { roomId: roomId });
    navigate('/rooms');
  };

  const handleStartGame = () => {
    socket.emit('startGame', roomId);
  };

  if (!room) return <div>Loading room...</div>;

  return (
    <div>
      <h1>Room: {room.name}</h1>
      <h3>Players:</h3>
      <ul>
        {room.players.map((p) => (
          <li key={p.userId}>
            {p.username} {p.username === username ? '(you)' : ''}
          </li>
        ))}
      </ul>

      <button onClick={handleStartGame} disabled={room.gameStarted}>
        Start Game
      </button>
      <button onClick={handleLeave}>Leave Room</button>
    </div>
  );
};

export default RoomPage;
