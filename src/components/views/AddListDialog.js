import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../css/add-item-dialog.css';
import { createNewList } from '../MutlimediaManagerApi';
import { tabToApi } from '../Utils';

const AddListDialog = ({ isOpen, onClose, activeApi, refreshSideBarList }) => {

  const [inputListName, setInputListName] = useState('');

  const handleInputChange = (event) => {
    setInputListName(event.target.value);
  };

  const onAddItem = async () => {
    console.log("Dodaje nową listę: " + inputListName + " do: " + activeApi);
    createNewList(inputListName, tabToApi(activeApi))
    setInputListName('');
    onClose();
    refreshSideBarList();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="add-item-dialog-content" overlayClassName="add-item-dialog-overlay">
      <h2>Dodaj nową listę</h2>
      <form>
        <label>
          Nazwa listy:
          <div className="select-container">
            <input autoFocus={true} maxLength={15} type="text" value={inputListName} onChange={handleInputChange} />
          </div>
        </label>
        <div className="button-container">
          <button type="button" onClick={onAddItem}>Dodaj</button>
          <button type="button" onClick={onClose}>Anuluj</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddListDialog;
