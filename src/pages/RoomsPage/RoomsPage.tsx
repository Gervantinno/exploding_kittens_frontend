import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../shared/api/socket';
import s from './RoomsPage.module.scss';
import { IRoom } from '../../shared/types/room';
import { setToken } from '../../shared/utils/token';
import CreateRoomModal from './components/CreateRoomModal/CreateRoomModal';
import { getUsername, setUsername } from '../../shared/utils/username';
import { setUserId } from '../../shared/utils/userId';

const RoomsPage = () => {
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const username = useMemo(() => {
    return getUsername();
  }, []);

  useEffect(() => {
    socket?.emit('getRooms');
    socket?.on('roomList', setRooms);
    socket?.on('roomCreated', (room: IRoom) => setRooms((prev) => [...prev, room]));

    return () => {
      socket?.off('roomList');
      socket?.off('roomCreated');
    };
  }, []);

  const handleJoinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  const leaveGame = () => {
    setToken('');
    setUsername('');
    setUserId('');
    navigate('/');
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [rooms, searchQuery]);

  return (
    <div className={s.page_wrapper}>
      <div className={s.header_wrapper}>
        <span>{username}</span>
        <button onClick={leaveGame}>Выйти из аккаунта</button>
      </div>
      <div className={s.title_wrapper}>
        <h1>Список комнат</h1>
        <CreateRoomModal />
      </div>
      <input
        type="text"
        placeholder="Поиск комнаты"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className={s.rooms_wrapper}>
        {filteredRooms
          .filter((room) => !room.gameStarted)
          .map((room) => (
            <div key={room.id} className={s.room_wrapper} onClick={() => handleJoinRoom(room.id)}>
              <span>{room.name}</span>
              <span>{room.players.length}/5</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RoomsPage;
