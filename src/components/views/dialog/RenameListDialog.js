import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../../css/add-item-dialog.css';
import { renameList } from '../../api/MutlimediaManagerApi';
import RegularButton from '../../basic/RegularButton';
import { tabToApi } from '../../utils/Utils';

const RenameListDialog = ({ isOpen, onClose, activeApi, activeList, refreshListsInApp, position }) => {

  const [newListName, setNewListName] = useState('');

  const handleInputChange = (event) => {
    setNewListName(event.target.value);
  };

  const onChangeName = async () => {
    console.log("Zmieniam nazwę listy na: " + newListName);
    renameList(newListName, activeList, tabToApi(activeApi), () => refreshListsInApp())
    setNewListName('');
    onClose();
  };

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
