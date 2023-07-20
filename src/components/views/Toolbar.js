import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { AiOutlineAppstoreAdd, AiOutlineFileDone } from 'react-icons/ai';
import { BsSortDownAlt, BsSortDown } from 'react-icons/bs';
import '../../css/toolbar.css';

const Toolbar = forwardRef((props, ref) => {

  const [recentlyDoneIsActive, setRecentlyDoneIsActive] = useState(false);
  const [selectedSortingOption, setSelectedSortingOption] = useState('');
  const [propertyToFind, setPropertyToFind] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [sortingDirection, setSortingDirection] = useState('DESC');

  const chooseProperSortKeys = (activeTab) => {
    const fieldsForTab = {
      'BOOK_LIST': [
        { value: '', label: 'Sortuj' },
        { value: 'id', label: 'ID' },
        { value: 'title', label: 'Tytuł' },
        { value: 'datePublished', label: 'Premiera' },
        { value: 'numberOfPages', label: 'Strony' }
      ],
      'MOVIE_LIST': [       
        { value: '', label: 'Sortuj' }, 
        { value: 'id', label: 'ID' },
        { value: 'polishTitle', label: 'Tytuł' },
        { value: 'releaseDate', label: 'Premiera' },
        { value: 'imDbRating', label: 'Ocena' },
        { value: 'imDbRatingVotes', label: 'Popularność' }
      ],
      'GAME_LIST': [
        { value: '', label: 'Sortuj' },
        { value: 'id', label: 'ID' },
        { value: 'title', label: 'Tytuł' },
        { value: 'releaseDate', label: 'Premiera' },
        { value: 'ratingValue', label: 'Ocena' },
        { value: 'ratingCount', label: 'Popularność' }
      ]
    }
    return fieldsForTab[activeTab];
  };


  const chooseProperSearchProperty = (activeTab) => {
    const fieldsForTab = {
      'BOOK_LIST': [
        { value: 'title', label: 'Tytuł' },
        { value: 'description', label: 'Opis' },
        { value: 'publisher', label: 'Wydawca' },
        { value: 'category', label: 'Kategoria' }
      ],
      'MOVIE_LIST': [       
        { value: 'polishTitle', label: 'Tytuł' },
        { value: 'titleOrg', label: 'Tytuł org' },
        { value: 'plotLocal', label: 'Opis' },
        { value: 'genreList', label: 'Gatunek' },
        { value: 'countryList', label: 'Produkcja' }
      ],
      'GAME_LIST': [
        { value: 'title', label: 'Tytuł' },
        { value: 'description', label: 'Opis' },
        { value: 'publisher', label: 'Wydawca' },
        { value: 'studio', label: 'Studio' },
        { value: 'playModes', label: 'Tryb gry' },
        { value: 'gamePlatform', label: 'Platforma' },
        { value: 'genreList', label: 'Gatunek' }
      ]
    }
    return fieldsForTab[activeTab];
  };

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedSortingOption(selectedOption);
    if (props.handleSortChange) {
      props.handleSortChange(selectedOption);
    }    
    setSortingDirection('ASC');
    if (props.handleSortDirectionChange) {
      props.handleSortDirectionChange('ASC');
    }
  };

  const handleRecentlyDone = () => {
    if (props.handleRecentlyDone) {
      props.handleRecentlyDone();
      setRecentlyDoneIsActive(!recentlyDoneIsActive)
    }
  };

  const handleSearchInputChange = (event) => {
      const inputValue = event.target.value;
      setSearchInputValue(inputValue);
      if(props.handleSearchInputChange && propertyToFind) {
        props.handleSearchInputChange(propertyToFind, inputValue);
      }
  }

  const handleChangingPropertyToFind = (event) => {
    let propertyToFind = event.target.value;
    if(propertyToFind === 'titleOrg') {
      propertyToFind = 'title'
    }
    setPropertyToFind(propertyToFind)
    if(props.handleSearchInputChange) {
      props.handleSearchInputChange(propertyToFind, searchInputValue);
    }
  }

  const handleAddItem = () => {
    if (props.handleRecentlyDone) {
      props.handleAddItem();
    }
  };

  const turnOffRecentlyDoneButton = () => {
    setRecentlyDoneIsActive(false)
  }

  const clearSearchInput = () => {
    setSearchInputValue('');
    let property = 'title';
    if(props.activeTab === 'MOVIE_LIST') {
      property = 'polishTitle'
    }
    setPropertyToFind(property)
  }

  const handleSortDirectionChange = () => {
    const newSortingDirection = sortingDirection === 'ASC' ? 'DESC' : 'ASC';
    setSortingDirection(newSortingDirection);
    if (props.handleSortDirectionChange) {
      props.handleSortDirectionChange(newSortingDirection);
    }
  }

  useImperativeHandle(ref, () => ({
    turnOffRecentlyDoneButton, clearSearchInput
  }));


  return (
    <div className="toolbar">
      <button onClick={handleAddItem} className="toolbar-button">
        <AiOutlineAppstoreAdd className="toolbar-icon" />
        Dodaj
      </button>
      <button 
        onClick={handleRecentlyDone} 
        className={`toolbar-button${recentlyDoneIsActive ? "-active" : ""}`}>
        <AiOutlineFileDone className='toolbar-icon'/>
        Ostatnie
      </button>
      <select 
        className="select-wrapper" 
        value={selectedSortingOption} 
        onChange={handleSortChange}
        disabled={recentlyDoneIsActive}
        >
        {chooseProperSortKeys(props.activeTab).map((option) => (
          <option className="select-option"
            key={option.value}
            value={option.value}
            disabled={option.value === ''}>
            {option.label}
          </option>
        ))}
      </select>
      <button onClick={handleSortDirectionChange} className="toolbar-button" disabled={recentlyDoneIsActive}>
        {sortingDirection === 'DESC' ? <BsSortDown className='toolbar-icon'/> : <BsSortDownAlt className='toolbar-icon' />}
        {sortingDirection === 'DESC' ? 'Malejąco' : 'Rosnąco'}
      </button>
      <div className="input-with-select">
        <input 
          type="text" 
          className="search-input" 
          value={searchInputValue}
          placeholder="Wyszukiwanie..." 
          disabled={recentlyDoneIsActive}
          maxLength={15}
          onChange={handleSearchInputChange}
          />  
          <select
            className="select-input"
            onChange={handleChangingPropertyToFind}
            value={propertyToFind}
            disabled={recentlyDoneIsActive}>
            {chooseProperSearchProperty(props.activeTab).map((option) => (
            <option className="select-option"
              key={option.value}
              value={option.value}
              >
              {option.label}
            </option>
        ))}
          </select>
      </div>
      
    </div>
  );
});


export default Toolbar;
