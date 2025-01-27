export interface ICard {
  name: string;
}

export interface IPlayer {
  name: string;
  cards: ICard[];
}

export interface IGameState {
  players: IPlayer[];
  deck: ICard[];
}

export const getGameState = (): IGameState => {
  return {
    players: [
      { name: 'Peter', cards: [{ name: 'a' }, { name: 'b' }, { name: 'c' }] },
      { name: 'Padre', cards: [{ name: 'b' }, { name: 'b' }, { name: 'c' }] },
      { name: 'Negr', cards: [{ name: 'a' }, { name: 'a' }, { name: 'c' }] },
      { name: 'Sos', cards: [{ name: 'c' }, { name: 'b' }, { name: 'c' }] },
    ],
    deck: [{ name: 'h' }, { name: 'f' }, { name: 't' }, { name: 'w' }],
  };
};
