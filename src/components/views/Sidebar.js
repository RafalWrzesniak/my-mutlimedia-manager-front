import React from 'react';
import { RiPlayListAddFill } from 'react-icons/ri';
import '../../css/sidebar.css';

const Sidebar = ({ lists, activeList, onListChange }) => {
  
    const handleListChange = (list) => {
      onListChange(list);
    };
  
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title"><h2>Moje listy</h2></span>
          <span className="sidebar-icon"><RiPlayListAddFill /></span>
        </div>
        <hr className="divider" />
        <ul>
          {lists.map((list) => (
            <li
              key={list.id}
              className={list.id === activeList ? 'active' : ''}
              onClick={() => handleListChange(list.id)}>
              <button>{list.name}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default Sidebar;