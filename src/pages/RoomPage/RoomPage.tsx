import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../shared/api/socket';
import { IRoom } from '../../shared/types/room';
import s from './RoomPage.module.scss';
import { getUsername } from '../../shared/utils/username';
import cat1 from '../../shared/img/cats/1.png';
import cat2 from '../../shared/img/cats/2.png';
import cat3 from '../../shared/img/cats/3.png';
import cat4 from '../../shared/img/cats/4.png';
import cat5 from '../../shared/img/cats/5.png';
import { getUserId } from '../../shared/utils/userId';

export const catImages = [cat1, cat2, cat3, cat4, cat5];

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [room, setIRoom] = useState<IRoom | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [copyLinkText, setCopyLinkText] = useState('Скопировать ссылку');

  useEffect(() => {
    if (!roomId) return;

    socket?.emit('joinRoom', roomId);
    socket?.on('roomUpdated', (room: IRoom) => setIRoom(room));
    socket?.on('gameStarted', () => navigate(`/game/${roomId}`));

    socket?.on('joinFailed', ({ reason }: { reason: string }) => {
      alert(reason);
      navigate('/room');
    });

    return () => {
      socket?.emit('leaveRoom', { roomId });
      socket?.off('roomUpdated');
      socket?.off('gameStarted');
      socket?.off('joinFailed');
    };
  }, [roomId]);

  useEffect(() => {
    if (room && getUserId() === room.players[0]?.userId) {
      setIsCreator(true);
    } else {
      setIsCreator(false);
    }
  }, [room]);

  const handleLeave = () => {
    socket?.emit('leaveRoom', { roomId: roomId });
    navigate('/room');
  };

  const handleStartGame = () => {
    socket?.emit('startGame', roomId);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyLinkText('Ссылка скопирована!');
    setTimeout(() => {
      setCopyLinkText('Скопировать ссылку');
    }, 2000);
  };

  if (!room) return <div>Загрузка комнаты...</div>;

  const username = getUsername();

  return (
    <div className={s.page_wrapper}>
      <div className={s.button_wrapper}>
        <button onClick={handleLeave}>Покинуть</button>
      </div>
      <div className={s.content_wrapper}>
        <div className={s.header_wrapper}>
          <h1>Комната: {room.name}</h1>
          <button onClick={handleCopyLink}>{copyLinkText}</button>
        </div>
        <div className={s.header_wrapper}>
          <h2>Игроки:</h2>
          {isCreator && (
            <button onClick={handleStartGame} disabled={room.gameStarted}>
              Начать
            </button>
          )}
        </div>
        <div className={s.players_wrapper}>
          {room.players.map((p) => (
            <div key={p.userId} className={s.player}>
              <img src={catImages[p.index]} />
              <span>{p.username === username ? 'вы' : p.username}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
