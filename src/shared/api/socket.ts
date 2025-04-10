import { io, Socket } from 'socket.io-client';

export let socket: Socket | undefined;

export const initSocket = (token: string): Socket => {
  socket = io('http://localhost:3000', {
    auth: { token },
    autoConnect: false, // Мы подключим вручную после установки токена
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;
