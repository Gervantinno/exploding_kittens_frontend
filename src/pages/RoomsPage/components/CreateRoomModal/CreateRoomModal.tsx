import { useEffect, useRef, useState } from 'react';
import s from './CreateRoomModal.module.scss';
import { useNavigate } from 'react-router-dom';
import { subscribeRoomCreated } from '../../../../shared/api/socket/rooms/subscribeRoomCreated';
import { emitCreateRoom } from '../../../../shared/api/socket/rooms/emitCreateRoom';
import Modal from '../../../../shared/components/Modal/Modal';

const CreateRoomModal = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    const unsubscribe = subscribeRoomCreated((room) => {
      if (isOpenRef.current) {
        console.log(isOpenRef.current, room);
        navigate(`/room/${room.id}`);
      }
    });

    return unsubscribe;
  }, [navigate]);

  const toggleVisibility = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const createRoom = () => {
    emitCreateRoom(roomName);
  };

  return (
    <div>
      <button onClick={toggleVisibility}>Создать комнату</button>

      {isOpen && (
        <Modal isOpen={isOpen} toggleVisibility={toggleVisibility} className={s.form_wrapper}>
          <h2>Создать комнату</h2>
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Название"
          />
          <button onClick={createRoom}>Создать</button>
        </Modal>
      )}
    </div>
  );
};

export default CreateRoomModal;
