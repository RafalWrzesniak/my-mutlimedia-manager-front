import React, { useState } from 'react';
import { RiPlayListAddFill } from 'react-icons/ri';
import '../../css/sidebar.css';
import AddListDialog from './AddListDialog';

const Sidebar = ({ lists, activeList, onListChange, activeApi, addNewList }) => {
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleListChange = (list) => {
    onListChange(list.id);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title"><h2>Moje listy</h2></span>
        <span onClick={handleOpenDialog} className="sidebar-icon"><RiPlayListAddFill /></span>
        <AddListDialog isOpen={isDialogOpen} onClose={handleCloseDialog} activeApi={activeApi} addNewList={addNewList} />
      </div>
      <hr className="divider" />
      <ul>
        {lists.map((list) => (
          <li
            key={list.id}
            className={list.id === activeList ? 'active' : ''}
            onClick={() => handleListChange(list)}>
            <button>{`${list.name}${list.items ? ' (' + list.items + ')' : ''}`}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

  export default Sidebar;