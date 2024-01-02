import React, { useState } from 'react';
import Modal from 'react-modal';
import '../../../css/add-item-dialog.css';
import { createBookFromUrl, createGameFromUrl, createMovieFromUrl } from '../../api/MutlimediaManagerApi';
import RegularButton from '../../basic/RegularButton';
import { isBook, isGame, isMovie } from '../../utils/Utils';

const AddItemDialog = ({ isOpen, onClose, lists, activeApi, addItemToListId, taskService }) => {

  const [inputUrl, setInputUrl] = useState('');
  const [platformOrVersion, setPlatformOrVersion] = useState('');
  const [selectedList, setSelectedList] = useState('');

  const handleInputChange = (event) => {
    setInputUrl(event.target.value);
  };

  const handleListChange = (event) => {
    setSelectedList(event.target.value);
  };

  const handlePlatformOrVersionChange = (event) => {
    setPlatformOrVersion(event.target.value);
  };

  const addItemToLists = (item) => {
    if(selectedList) {
      addItemToListId(item, selectedList)
    }
    if(isBook(item)) {
      let allBooks = lists.filter(list => list.listType === 'BOOK_LIST' && list.allContentList)[0]
      addItemToListId(item, allBooks.id)
    } else if(isGame(item)) {      
      let allGames = lists.filter(list => list.listType === 'GAME_LIST' && list.allContentList)[0]
      addItemToListId(item, allGames.id)
    } else if(isMovie(item)) {      
      let allMovies = lists.filter(list => list.listType === 'MOVIE_LIST' && list.allContentList)[0]
      addItemToListId(item, allMovies.id)
    }
    
  };

  const onAddItem = () => {
    console.log("Dodaje: " + inputUrl);
    console.log("Wybrana lista: " + selectedList);
    console.log("Wybrana zakładka: " + activeApi);
    if(activeApi === 'book') {
      let task = 'Dodaję książkę z linku: ' + inputUrl;
      taskService.setTask(task, true);
      createBookFromUrl(inputUrl, selectedList, platformOrVersion, onSuccessAddItem,  (failureResponse) => onFailAddItem(failureResponse, 'książki'))
    } else if(activeApi === 'game') {
      let task = 'Dodaję grę z linku: ' + inputUrl;
      taskService.setTask(task, true);
      createGameFromUrl(inputUrl, selectedList, platformOrVersion, onSuccessAddItem, (failureResponse) => onFailAddItem(failureResponse, 'gry'))
    } else if(activeApi === 'movie') {
      let task = 'Dodaję film z linku: ' + inputUrl;
      taskService.setTask(task, true);
      createMovieFromUrl(inputUrl, selectedList, onSuccessAddItem, (failureResponse) => onFailAddItem(failureResponse, 'filmu'))
    }
    setInputUrl('');
    setSelectedList('');
    onClose();
  };

  const onFailAddItem = (response, product) => {
    let task = 'Nie udało utworzyć się ' + product + ' z podanego linku :(';
    let message = response.response.data.messages[0];
    if(message.includes('Invalid') && message.includes('url')) {
      task = task + ' Podany link jest nieprawidłowy'
    }
    taskService.setTask(task);
  }

  const onSuccessAddItem = (response) => {
    addItemToLists(response.data);
    let title = response.data.polishTitle ? response.data.polishTitle : response.data.title;
    let task = '"' + decodeURIComponent(title) + '" dodane do aplikacji';
    taskService.setTask(task);
  }

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
                  value={list.id} 
                  disabled={list.allContentList}
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
            <select className="select-dropdown" value={platformOrVersion} onChange={handlePlatformOrVersionChange}>
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
        <div className="horizontal-container-right">
          <RegularButton text='Dodaj' onClick={onAddItem} extraStyle='small' />
          <RegularButton text='Anuluj' onClick={onClose} extraStyle='small' />
        </div>
      </form>
    </Modal>
  );
};

export default AddItemDialog;
