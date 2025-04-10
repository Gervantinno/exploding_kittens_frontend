import { socket } from '../../socket';

export const emitCreateRoom = (roomName: string) => {
  if (roomName.trim()) {
    socket.emit('createRoom', roomName);
  }
};
