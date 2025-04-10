import { IPlayer } from './player';

export interface IRoom {
  id: string;
  name: string;
  players: IPlayer[];
  gameStarted: boolean;
}
