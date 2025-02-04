import { IPlayer } from '../utils/getGameState';
import socket from './socket';

//eslint-disable-next-line
export function subcribeGame(callback: (state: any) => void) {
  socket.on('update-game', callback);
}

export interface ILeaveGame {
  gameId: string;
  newPlayer: IPlayer;
}

export function unsubscribeGame(body: ILeaveGame) {
  socket.off('update-game');
  socket.emit('leave-game', body);
}

export interface IConnectToGame {
  gameId: string;
  newPlayer: IPlayer;
}

//eslint-disable-next-line
export function connectToGame(body: IConnectToGame, callback: (state: any) => void) {
  subcribeGame(callback);
  socket.emit('join-game', body);
}
