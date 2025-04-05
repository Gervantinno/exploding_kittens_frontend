export interface ICard {
  name: string;
}

export interface IPlayer {
  id: string;
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
      { id: '1', name: 'Peter', cards: [{ name: 'a' }, { name: 'b' }, { name: 'c' }] },
      { id: '2', name: 'Padre', cards: [{ name: 'b' }, { name: 'b' }, { name: 'c' }] },
      { id: '3', name: 'Negr', cards: [{ name: 'a' }, { name: 'a' }, { name: 'c' }] },
      { id: '4', name: 'Sos', cards: [{ name: 'c' }, { name: 'b' }, { name: 'c' }] },
    ],
    deck: [{ name: 'h' }, { name: 'f' }, { name: 't' }, { name: 'w' }],
  };
};
