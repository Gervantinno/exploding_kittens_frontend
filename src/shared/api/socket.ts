import { io, Socket } from 'socket.io-client';

export let socket: Socket | undefined;

export const initSocket = (token: string): Socket => {
  socket = io('http://localhost:3000', {
    auth: { token },
    autoConnect: false,
  });

  return socket;
};

export const getSocket = (): Socket | undefined => socket;
