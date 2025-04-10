import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { socket } from '../../shared/api/socket';

const RoomsPage = () => {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit('getRooms');
    socket.on('roomList', setRooms);
    socket.on('roomCreated', (room) => setRooms((prev) => [...prev, room]));

    return () => {
      socket.off('roomList');
      socket.off('roomCreated');
    };
  }, []);

  const handleJoinRoom = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <div>
      <Link to="/create">Create Room</Link>
      <h1>Список комнат</h1>
      <ul>
        {rooms
          .filter((room) => !room.gameStarted)
          .map((room) => (
            <li key={room.id}>
              <button onClick={() => handleJoinRoom(room.id)}>{room.name}</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default RoomsPage;
