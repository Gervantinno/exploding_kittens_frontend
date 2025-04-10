import { socket } from '../../socket';
import { IRoom } from '../../../types/room';

type Callback = (room: IRoom) => void;

export const subscribeRoomCreated = (cb: Callback) => {
  socket?.on('roomCreated', cb);
  return () => {
    socket?.off('roomCreated', cb);
  };
};
