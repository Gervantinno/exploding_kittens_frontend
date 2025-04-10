import { useEffect } from 'react';
import { socket } from '../../../../shared/api/socket';
import { IRoom } from '../../../../shared/types/room';
import { IGameState } from '../../../../shared/types/gamestate';
import { getUserId } from '../../../../shared/utils/userId';
import ChooseFavorTargetModalContent from '../ChooseFavorTargetModalContent/ChooseFavorTargetModalContent';
import GiveFavorCardModalContent from '../GiveFavorCardModalContent/GiveFavorCardModalContent';

interface GameLogicProps {
  roomId: string | undefined;
  gamestate: IGameState | undefined;
  setGamestate: (gamestate: IGameState) => void;
  setRoom: (room: IRoom) => void;
  setFutureCards: (cards: string[]) => void;
  setFavorRequest: (player: string | null) => void;
  setWinner: (winner: { userId: string; username: string } | null) => void;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  opponentsNotLost: any[]; // fix type
  userId: string | undefined;
  handleChooseFavorTarget: (targetPlayerId: string) => void;
  setExplodeEffect: (explode: boolean) => void;
  setDefuseEffect: (defuse: boolean) => void;
  handleGiveFavorCard: (card: string, toUserId: string) => void;
}

const GameLogic: React.FC<GameLogicProps> = ({
  roomId,
  gamestate,
  setGamestate,
  setRoom,
  setFutureCards,
  setFavorRequest,
  setWinner,
  openModal,
  closeModal,
  opponentsNotLost,
  userId,
  handleChooseFavorTarget,
  setExplodeEffect,
  setDefuseEffect,
  handleGiveFavorCard,
}) => {
  useEffect(() => {
    if (roomId) socket?.emit('joinRoom', roomId);

    socket?.on('roomUpdated', (room: IRoom) => setRoom(room));

    socket?.on('gameState', (newGame) => {
      setGamestate(newGame);
    });

    socket?.on('cardEffect', ({ player, effect }) => {
      console.log(`${player}: ${effect}`);
      if (effect.includes('exploded')) {
        setExplodeEffect(true);
        setTimeout(() => {
          setExplodeEffect(false);
        }, 1000);
      }
      if (effect.includes('defused')) {
        setDefuseEffect(true);
        setTimeout(() => {
          setDefuseEffect(false);
        }, 1000);
      }
    });

    socket?.on('seeFuture', (cards) => {
      setFutureCards(cards);
    });

    socket?.on('requestFavor', (player) => {
      setFavorRequest(player);
    });

    socket?.on('gameOver', (data) => {
      console.log('gameOver', data);
      setWinner(data.winner);
    });

    socket?.on('chooseFavorTarget', (userId) => {
      if (userId !== getUserId()) return;

      if (opponentsNotLost.length === 1) {
        handleChooseFavorTarget(opponentsNotLost[0].userId);
        return;
      }

      openModal(
        <ChooseFavorTargetModalContent
          opponentsNotLost={opponentsNotLost}
          handleChooseFavorTarget={handleChooseFavorTarget}
          gamestate={gamestate}
        />
      );
    });

    socket?.on('requestFavorCard', (data: { fromUserId: string; toUserId: string }) => {
      if (data.fromUserId !== getUserId()) return;

      const toPlayer = gamestate?.players.find((p) => p.userId === data.toUserId);
      openModal(
        <GiveFavorCardModalContent
          hand={gamestate?.playerHands[userId || ''] || []}
          toPlayerUsername={toPlayer?.username}
          handleGiveFavorCard={handleGiveFavorCard}
          toUserId={data.toUserId}
        />
      );
    });

    socket?.on('giveFavorCardDone', (id) => {
      if (id !== userId) return;

      closeModal();
    });

    socket?.on('gameReseted', () => {
      closeModal();
    });

    return () => {
      socket?.off('gameState');
      socket?.off('cardEffect');
      socket?.off('seeFuture');
      socket?.off('requestFavor');
      socket?.off('gameOver');
      socket?.off('chooseFavorTarget');
      socket?.off('requestFavorCard');
      socket?.off('giveFavorCardDone');
      socket?.off('gameReseted');
    };
  }, [roomId, gamestate?.currentTurn]);

  return null;
};

export default GameLogic;
