import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../../css/add-item-dialog.css';
import { createNewList } from '../../api/MutlimediaManagerApi';
import RegularButton from '../../basic/RegularButton';
import { tabToApi } from '../../utils/Utils';

const AddListDialog = ({ isOpen, onClose, activeApi, addNewList, taskService }) => {

  const [inputListName, setInputListName] = useState('');

  const handleInputChange = (event) => {
    setInputListName(event.target.value);
  };

  const onAddItem = async () => {
    console.log("Dodaje nową listę: " + inputListName + " do: " + activeApi);
    taskService.setTask('Dodaję nową listę "'+inputListName+'"', true)
    createNewList(inputListName, tabToApi(activeApi), response => {
      addNewList(response.data);
      taskService.setTask('Utworzono nową listę "'+inputListName+'"');
    }, () => taskService.setTask('Nie udało się utworzyć listy "'+inputListName+'"'));
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
            <input autoFocus={true} maxLength={25} type="text" value={inputListName} onChange={handleInputChange} />
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
