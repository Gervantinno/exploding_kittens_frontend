import { IPlayer } from './player';

export interface IGameState {
  roomId: string;
  players: IPlayer[];
  currentTurn: string;
  cardsToDraw: number;
  deck: string[];
  started: boolean;
  playerHands: Record<string, string[]>;
  attackMode: boolean;
}
