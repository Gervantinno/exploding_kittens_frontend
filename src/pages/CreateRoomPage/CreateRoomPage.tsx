import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emitCreateRoom } from '../../shared/api/socket/rooms/emitCreateRoom';
import { subscribeRoomCreated } from '../../shared/api/socket/rooms/subscribeRoomCreated';

const CreateRoomPage = () => {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeRoomCreated((room) => {
      navigate(`/room/${room.id}`);
    });

    return unsubscribe;
  }, [navigate]);

  return (
    <div>
      <h1>Create Room</h1>
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room name"
      />
      <button onClick={() => emitCreateRoom(roomName)}>Create</button>
    </div>
  );
};

export default CreateRoomPage;
