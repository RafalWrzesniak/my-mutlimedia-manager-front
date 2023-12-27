import React from 'react';
import Modal from 'react-modal';
import '../../../css/add-item-dialog.css';
import RegularButton from '../../basic/RegularButton';

const ConfirmationDialog = ({ isOpen, onClose, dialogTitle, onUserConfirm, position }) => {

  const onConfirm = () => {
    onUserConfirm();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="add-item-dialog-content" overlayClassName="add-item-dialog-overlay" style={position}>
      <h2>{dialogTitle}</h2>
      <div className="horizontal-container-right">
        <RegularButton text='Potwierdź' onClick={onConfirm} extraStyle='small' />
        <RegularButton text='Anuluj' onClick={onClose} extraStyle='small' />
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
