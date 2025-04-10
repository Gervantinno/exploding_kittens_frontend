import React, { PropsWithChildren } from 'react';
import s from './Modal.module.scss';

type ModalProps = {
  isOpen: boolean;
  toggleVisibility: () => void;
  className?: string;
};

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({
  isOpen,
  className,
  toggleVisibility,
  children,
}) => {
  if (!isOpen) return null;
  return (
    <div className={s.modal_wrapper} onClick={toggleVisibility}>
      <div className={`${className ? className : ''}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
