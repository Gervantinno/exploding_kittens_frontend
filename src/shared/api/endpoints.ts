import socket from './socket';

//eslint-disable-next-line
export function subcribeGame(callback: (state: any) => void) {
  socket.on('update-game', callback);
}

export function unsubscribeGame() {
  socket.off('update-game');
}

//eslint-disable-next-line
export function connectToGame(name: string, callback: (state: any) => void) {
  socket.emit('join-game', name);
  subcribeGame(callback);
}
