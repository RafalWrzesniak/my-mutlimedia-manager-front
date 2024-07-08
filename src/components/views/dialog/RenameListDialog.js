import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../../../css/add-item-dialog.css';
import { renameListOnServer } from '../../api/MultimediaManagerApi';
import RegularButton from '../../basic/RegularButton';
import { tabToApi } from '../../utils/Utils';

const RenameListDialog = ({ isOpen, onClose, activeApi, activeList, renameList, position, currentName, taskService }) => {

  const [newListName, setNewListName] = useState('');

  const handleInputChange = (event) => {
    setNewListName(event.target.value);
  };

  const onChangeName = async () => {
    taskService.setTask(`Zmieniłeś nazwę listy z '${currentName}' na '${newListName}'`);
    renameListOnServer(newListName, activeList, tabToApi(activeApi), () => renameList(activeList, newListName), () => taskService.setTask(`Nie udało się zmienić nazwy listy z '${currentName}' na '${newListName}'`))
    setNewListName('');
    onClose();
  };

  useEffect(() => {
    setNewListName(currentName)
  }, [currentName]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="add-item-dialog-content" overlayClassName="add-item-dialog-overlay" style={position} >
      <h2>Zmień nazwę listy</h2>
      <form>
        <label>
          Nowa nazwa:
          <div className="select-container">
            <input autoFocus={true} maxLength={25} type="text" value={newListName} onChange={handleInputChange} />
          </div>
        </label>
        <div className="horizontal-container-right">
          <RegularButton text='Zmień' onClick={onChangeName} extraStyle='small' />
          <RegularButton text='Anuluj' onClick={onClose} extraStyle='small' />
        </div>
      </form>
    </Modal>
  );
};

export default RenameListDialog;
