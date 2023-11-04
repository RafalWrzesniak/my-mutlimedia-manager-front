import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../css/add-item-dialog.css';
import { createNewList } from '../api/MutlimediaManagerApi';
import RegularButton from '../basic/RegularButton';
import { tabToApi } from '../utils/Utils';

const AddListDialog = ({ isOpen, onClose, activeApi, addNewList }) => {

  const [inputListName, setInputListName] = useState('');

  const handleInputChange = (event) => {
    setInputListName(event.target.value);
  };

  const onAddItem = async () => {
    console.log("Dodaje nową listę: " + inputListName + " do: " + activeApi);
    createNewList(inputListName, tabToApi(activeApi), response => addNewList(response.data))
    setInputListName('');
    onClose();
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
        <div className="horizontal-container-right">
          <RegularButton text='Dodaj' onClick={onAddItem} extraStyle='small' />
          <RegularButton text='Anuluj' onClick={onClose} extraStyle='small' />
        </div>
      </form>
    </Modal>
  );
};

export default AddListDialog;
