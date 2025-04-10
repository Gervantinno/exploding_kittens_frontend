import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../../shared/api/socket';
import { IRoom } from '../../shared/types/room';
import s from './GamePage.module.scss';
import Modal from '../../shared/components/Modal/Modal';
import { IGameState } from '../../shared/types/gamestate';
import { getUserId } from './../../shared/utils/userId';
import { cardImages } from './components/PlayerCard/PlayerCard';
import Board from './components/Board/Board';
import GameLogic from './components/GameLogic/GameLogic';
import useModal from '../../shared/hooks/useModal';
import ChooseFavorTargetModalContent from './components/ChooseFavorTargetModalContent/ChooseFavorTargetModalContent';
import back_card from '../../shared/img/cards/back.png';

export const catCards = ['taco_cat', 'hairy_potato_cat'];

export const cardTypes = [
  'attack',
  'skip',
  'favor',
  'shuffle',
  'see_the_future',
  'defuse',
  'taco_cat',
  'hairy_potato_cat',
  'bomb',
];

const GamePage = () => {
  const navigate = useNavigate();

  const { roomId } = useParams();
  const [futureCards, setFutureCards] = useState<string[]>([]);
  const [favorRequest, setFavorRequest] = useState<string | null>(null);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [showCardChoices, setShowCardChoices] = useState(false);
  const [targetPlayerId, setTargetPlayerId] = useState<string | null>(null);
  const [winner, setWinner] = useState<{ userId: string; username: string } | null>(null);
  const [room, setRoom] = useState<IRoom>();
  const [gamestate, setGamestate] = useState<IGameState>();
  const [explodeEffect, setExplodeEffect] = useState(false);
  const [defuseEffect, setDefuseEffect] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string>();
  const [numberOfCards, setNumberOfCards] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const { isModalOpen, modalContent, openModal, closeModal } = useModal();

  const userId = getUserId();

  const currentPlayer = gamestate?.players.find((player) => player.userId === getUserId());
  const opponents =
    gamestate?.players.filter((player) => player.userId !== currentPlayer?.userId) || [];
  const opponentsNotLost = opponents.filter((player) => !player.hasLost);

  const handlePlayCombo = (selectedCardType: string) => {
    if (opponentsNotLost.length === 1) {
      handleChooseComboTarget(opponentsNotLost[0].userId, selectedCardType);
      return;
    }

    openModal(
      <ChooseFavorTargetModalContent
        opponentsNotLost={opponentsNotLost}
        handleChooseFavorTarget={(targetPlayerId) =>
          handleChooseComboTarget(targetPlayerId, selectedCardType || '')
        }
        gamestate={gamestate}
      />
    );
  };

  const handleChooseComboTarget = (targetPlayerId: string, selectedCardType: string) => {
    const targetPlayer = gamestate?.players.find((p) => p.userId === targetPlayerId);

    openModal(
      <div className={s.modal_content}>
        <h2>Выберите какую карту забрать:</h2>
        <div className={s.img_wrapper}>
          {gamestate?.playerHands[targetPlayer?.userId || '']?.map((card, index) => (
            <img
              key={index}
              src={back_card}
              className={s.card_image}
              onClick={() => handleTakeCard(card, targetPlayerId, selectedCardType)}
            />
          ))}
        </div>
      </div>
    );
  };

  const handleTakeCard = (card: string, targetPlayerId: string, selectedCardType: string) => {
    socket?.emit('takeComboCard', {
      roomId: roomId,
      fromPlayer: targetPlayerId,
      card: card,
      comboCard: selectedCardType,
    });
    closeModal();
    resetCardSelection();
  };

  const handleChooseFavorTarget = (targetPlayerId: string) => {
    socket?.emit('chooseFavorTargetDone', {
      roomId: roomId,
      targetPlayerId: targetPlayerId,
    });
    openModal(
      <div className={s.modal_content}>
        <h2>
          Ожидайте пока{' '}
          {gamestate?.players.find((player) => player.userId === targetPlayerId)?.username} выберет
          карту.
        </h2>
      </div>
    );
  };

  const handleGiveFavorCard = (card: string, toUserId: string) => {
    socket?.emit('giveFavorCard', {
      roomId: roomId,
      fromPlayer: userId,
      toPlayer: toUserId,
      card: card,
    });
    closeModal();
  };

  useEffect(() => {
    if (futureCards.length > 0) {
      openModal(
        <div className={s.img_wrapper}>
          {futureCards.map((card, index) => (
            <img
              key={index}
              src={cardImages[card] || ''}
              className={s.card_image}
              alt={`Future Card ${index}`}
            />
          ))}
        </div>
      );
    }
  }, [futureCards]);

  useEffect(() => {
    if (winner) {
      openModal(
        <div className={s.modal_content}>
          <h2>Игра окончена!</h2>
          <h3>Победил: {winner.username}</h3>
          <button onClick={handleRestart}>Начать заново</button>
        </div>
      );
    }
  }, [winner]);

  const handleDrawCard = useCallback(() => {
    if (userId !== gamestate?.currentTurn) return;

    socket?.emit('drawCard', roomId);
    resetSelections();
  }, [roomId, gamestate?.currentTurn, socket, userId]);

  const handlePlayCard = (card: string) => {
    socket?.emit('playCard', { roomId, card });
    resetSelections();
  };

  const handleSelectCard = (card: string, index: number) => {
    setSelectedCard(card);
    setNumberOfCards((prev) => prev + 1);
    setSelectedIndexes((prev) => [...prev, index]);
  };

  const resetCardSelection = () => {
    setSelectedCard(undefined);
    setNumberOfCards(0);
    setSelectedIndexes([]);
  };

  const handleRestart = () => {
    socket?.emit('restartGame', roomId);
    setWinner(null);
    resetSelections();
    closeModal();
  };

  const resetSelections = () => {
    setSelectedCats([]);
    setTargetPlayerId(null);
    setShowCardChoices(false);
  };

  const handleLeave = () => {
    if (!roomId) return;

    socket?.emit('leaveRoom', roomId);
    navigate('/room');
  };

  console.log('currentTurn', gamestate?.currentTurn);
  console.log('userId', userId);
  console.log('getUserId', getUserId());

  return (
    <div className={s.page_wrapper}>
      <button onClick={handleLeave} className={s.exit_button}>
        Покинуть
      </button>

      <GameLogic
        roomId={roomId}
        gamestate={gamestate}
        setGamestate={setGamestate}
        setRoom={setRoom}
        setFutureCards={setFutureCards}
        setFavorRequest={setFavorRequest}
        setWinner={setWinner}
        openModal={openModal}
        closeModal={closeModal}
        opponentsNotLost={opponentsNotLost}
        userId={userId}
        handleChooseFavorTarget={handleChooseFavorTarget}
        setExplodeEffect={setExplodeEffect}
        setDefuseEffect={setDefuseEffect}
        handleGiveFavorCard={handleGiveFavorCard}
      />

      <Board
        hand={gamestate?.playerHands[currentPlayer?.userId || ''] || []}
        isCurrentTurn={gamestate?.currentTurn === userId}
        handlePlayCard={handlePlayCard}
        opponents={opponents}
        gamestate={gamestate}
        isExplodeEffect={explodeEffect}
        handleDrawCard={handleDrawCard}
        currentPlayer={currentPlayer}
        playCombo={handlePlayCombo}
        selectedCard={selectedCard}
        numberOfCards={numberOfCards}
        resetSelection={resetCardSelection}
        handleSelectCard={handleSelectCard}
        selectedIndexes={selectedIndexes}
        isDefuseEffect={defuseEffect}
      />

      <Modal isOpen={isModalOpen} toggleVisibility={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default GamePage;
