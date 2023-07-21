import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../css/add-item-dialog.css';
import { createBookFromUrl, createGameFromUrl, createMovieFromUrl } from '../MutlimediaManagerApi';

const AddItemDialog = ({ isOpen, onClose, lists, activeApi }) => {

  const [inputUrl, setInputUrl] = useState('');
  const [platformOrVersion, setPlatformOrVersion] = useState('');
  const [selectedList, setSelectedList] = useState('');

  const handleInputChange = (event) => {
    setInputUrl(event.target.value);
  };

  const handleListChange = (event) => {
    setSelectedList(event.target.value);
  };

  const handlePlatformOrVersionChane = (event) => {
    setPlatformOrVersion(event.target.value);
  };

  const onAddItem = () => {
    console.log("Dodaje: " + inputUrl);
    console.log("Wybrana lista: " + selectedList);
    console.log("Wybrana zakładka: " + activeApi);
    if(activeApi === 'book') {
      createBookFromUrl(inputUrl, selectedList, platformOrVersion)
    } else if(activeApi === 'game') {
      createGameFromUrl(inputUrl, selectedList, platformOrVersion)
    } else if(activeApi === 'movie') {
      createMovieFromUrl(inputUrl, selectedList)
    }
    setInputUrl('');
    setSelectedList('');
    onClose();
  };

  const getPlaceHolder = () => {
    if(activeApi === 'book') {
      return 'https://lubimyczytac.pl/ksiazka/...'
    } else if(activeApi === 'game') {
      return 'https://www.gry-online.pl/gry/...'
    } else if(activeApi === 'movie') {
      return 'https://www.filmweb.pl/film/...'
    }
    return 'Url dodawanego obiektu';
  }

  const choosePlatformOrVersion = (activeTab) => {
    const fieldsForTab = {
      'book': [
        { value: 'Paper', label: 'Papier' },
        { value: 'Digital', label: 'E-book' }
      ],
      'game': [
        { value: 'PS5', label: 'PS5' },
        { value: 'PC', label: 'PC' }
      ]
    }
    return fieldsForTab[activeTab];
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="add-item-dialog-content" overlayClassName="add-item-dialog-overlay">
      <h2>Dodaj nowy element</h2>
      <form>
        <label>
          URL:
          <div className="select-container">
            <input autoFocus={true} maxLength={100} type="text" value={inputUrl} onChange={handleInputChange} placeholder={getPlaceHolder()} />
          </div>
        </label>
        <label>
          Dodaj do listy:
          <div className="select-container">
            <select className="select-dropdown" value={selectedList} onChange={handleListChange}>
              <option value="" className="select-option">-</option>
              {lists.map((list) => (
                <option 
                  key={list.id} 
                  value={list.name} 
                  disabled={list.name === 'Wszystkie książki' || list.name === 'Wszystkie filmy' || list.name === 'Wszystkie gry'}
                  className="select-option">
                  {list.name}
                </option>
              ))}
            </select>
          </div>
        </label>
        {(activeApi==='book' || activeApi==='game') && (
          <label>
          {activeApi=== 'book' ? 'Wybierz format' : 'Wybierz platformę'}
          <div className="select-container">
            <select className="select-dropdown" value={platformOrVersion} onChange={handlePlatformOrVersionChane}>
              <option value="" className="select-option">-</option>
              {choosePlatformOrVersion(activeApi).map((option) => (
                <option 
                  key={option.value}
                  value={option.value}
                  className="select-option">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </label>
        )}
        <div className="button-container">
          <button type="button" onClick={onAddItem}>Dodaj</button>
          <button type="button" onClick={onClose}>Anuluj</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddItemDialog;
