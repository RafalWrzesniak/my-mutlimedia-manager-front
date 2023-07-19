import React from 'react';
import { PiBooksDuotone } from 'react-icons/pi';
import { IoGameControllerOutline } from 'react-icons/io5';
import { BiCameraMovie } from 'react-icons/bi';
import '../../css/tab-menu.css';

const TabMenu = ({ activeTab, onTabChange }) => {
    const handleTabChange = (tab) => {
      onTabChange(tab);
    };
  
    return (
      <div className="tab-menu">
        <div
          className={`tab ${activeTab === 'BOOK_LIST' ? 'active' : ''}`}
          onClick={() => handleTabChange('BOOK_LIST')}
        >
        <PiBooksDuotone className="tab-icon" />
          Książki
        </div>
        <div
          className={`tab ${activeTab === 'MOVIE_LIST' ? 'active' : ''}`}
          onClick={() => handleTabChange('MOVIE_LIST')}
        >
        <BiCameraMovie className="tab-icon" />
          Filmy
        </div>
        <div
          className={`tab ${activeTab === 'GAME_LIST' ? 'active' : ''}`}
          onClick={() => handleTabChange('GAME_LIST')}
        >
        <IoGameControllerOutline className="tab-icon" />
          Gry
        </div>
      </div>
    );
  };

  export default TabMenu;