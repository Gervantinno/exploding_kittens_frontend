import { socket } from '../../socket';
import { Room } from '../../../types/room';

type Callback = (room: Room) => void;

export const subscribeRoomCreated = (cb: Callback) => {
  socket.on('roomCreated', cb);
  return () => {
    socket.off('roomCreated', cb);
  };
};
