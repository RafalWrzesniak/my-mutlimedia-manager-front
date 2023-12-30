import React, { useState } from 'react';
import { MdPlaylistRemove, MdPlaylistAdd, MdDriveFileRenameOutline } from "react-icons/md";
import '../../css/sidebar.css';
import AddListDialog from './dialog/AddListDialog';
import RenameListDialog from './dialog/RenameListDialog';
import ConfirmationDialog from './dialog/ConfirmationDialog';
import RegularButton from '../basic/RegularButton';
import { removeListFromUser } from '../api/MutlimediaManagerApi';
import { tabToApi } from '../utils/Utils';

const Sidebar = ({ lists, activeList, onListChange, activeApi, addNewList, refreshListsInApp }) => {
  
  const [isAddListDialogOpen, setIsAddListDialogOpen] = useState(false);
  const [isRenameListDialogOpen, setIsRenameListDialogOpen] = useState(false);
  const [isDeleteListDialogOpen, setIsDeleteListDialogOpen] = useState(false);
  const [bottomRightOfActiveList, setBottomRightOfActiveList] = useState()

  const handleListChange = (event, list) => {
    const divRect = event.target.getBoundingClientRect();
    const x = divRect.right;
    const y = divRect.bottom;
    const position = {
      content: {
        left: Math.round(x)+'px',
        top: Math.round(y)+'px'
      }
    };
    setBottomRightOfActiveList(position)
    onListChange(list.id);
  };

  const removeList = () => {
    console.log("Usuwam liste z id: ", activeList);
    removeListFromUser(activeList, tabToApi(activeApi), refreshListsInApp);
  }

  const getCurrentList = () => {
    return lists.filter(list => list.id === activeList)[0]
  }

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          <span className="sidebar-title"><h2>Moje listy</h2></span>
        </div>
        <hr className="divider" />
        <ul>
          {lists.map((list) => (
            <li
              key={list.id}
              className={list.id === activeList ? 'active' : ''}
              onClick={(event) => handleListChange(event, list)}>
              <button>{`${list.name}${list.items ? ' (' + list.items + ')' : ''}`}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-menu">
        <RegularButton text='Dodaj' icon={<MdPlaylistAdd/>} onClick={() => setIsAddListDialogOpen(true)} extraStyle='small' />
        <AddListDialog isOpen={isAddListDialogOpen} onClose={() => setIsAddListDialogOpen(false)} activeApi={activeApi} addNewList={addNewList} />
        <RegularButton text='Edytuj' icon={<MdDriveFileRenameOutline/>} onClick={() => setIsRenameListDialogOpen(true)} extraStyle='small' />
        <RenameListDialog isOpen={isRenameListDialogOpen} onClose={() => setIsRenameListDialogOpen(false)} activeApi={activeApi} activeList={activeList} refreshListsInApp={refreshListsInApp} position={bottomRightOfActiveList} currentName={getCurrentList() && getCurrentList().name} />
        <RegularButton text='Usuń' icon={<MdPlaylistRemove/>} onClick={() => setIsDeleteListDialogOpen(true)} extraStyle='small' disabled={getCurrentList() && getCurrentList().allContentList === true} />
        <ConfirmationDialog isOpen={isDeleteListDialogOpen} onClose={() => setIsDeleteListDialogOpen(false)} onUserConfirm={removeList} secondaryText="Czy na pewno chcesz ją usunąć? Tego nie da się cofnąć!" dialogTitle={`Lista: ${getCurrentList() && getCurrentList().name}`} position={bottomRightOfActiveList} />
      </div>
    </div>
  );
};

  export default Sidebar;