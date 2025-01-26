import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { AiOutlineAppstoreAdd, AiOutlineFileDone } from 'react-icons/ai';
import { BsSortDown, BsSortUp } from 'react-icons/bs';
import '../../css/toolbar.css';
import RegularButton from '../basic/RegularButton';
import Switch from "react-switch";

const Toolbar = forwardRef((props, ref) => {

  const [recentlyDoneIsActive, setRecentlyDoneIsActive] = useState(false);
  const [selectedSortingOption, setSelectedSortingOption] = useState('');
  const [sortingOptions, setSortingOptions] = useState([]);
  const [propertyToFind, setPropertyToFind] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [sortingDirection, setSortingDirection] = useState('ASC');
  const [showTitle, setShowTitle] = useState(false);

  const chooseProperSortKeys = (activeTab) => {
    const fieldsForTab = {
      'BOOK_LIST': [
        { value: 'createdOn', label: 'Utworzono' },
        { value: 'title', label: 'Tytuł' },
        { value: 'datePublished', label: 'Premiera' },
        { value: 'readOn', label: 'Przeczytano' },
        { value: 'numberOfPages', label: 'Strony' },
        { value: 'updatedOn', label: 'Edytowano' }
      ],
      'MOVIE_LIST': [       
        { value: 'createdOn', label: 'Utworzono' },
        { value: 'polishTitle', label: 'Tytuł' },
        { value: 'runtimeMins', label: 'Długość' },
        { value: 'releaseDate', label: 'Premiera' },
        { value: 'imDbRating', label: 'Ocena' },
        { value: 'imDbRatingVotes', label: 'Popularność' },
        { value: 'watchedOn', label: 'Oglądnięto' },
        { value: 'updatedOn', label: 'Edytowano' }
      ],
      'GAME_LIST': [
        { value: 'createdOn', label: 'Utworzono' },
        { value: 'title', label: 'Tytuł' },
        { value: 'releaseDate', label: 'Premiera' },
        { value: 'finishedOn', label: 'Ukończono' },
        { value: 'playedHours', label: 'Czas gry' },
        { value: 'ratingValue', label: 'Ocena' },
        { value: 'ratingCount', label: 'Popularność' },
        { value: 'updatedOn', label: 'Edytowano' }
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
        { value: 'category', label: 'Kategoria' },
        { value: 'author', label: 'Autor' },
        { value: 'bookFormat', label: 'Format' },
        { value: 'series', label: 'Seria' }
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
        { value: 'userGamePlatform', label: 'Grano na' },
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

  const restartSorting = (newTab) => {
    createOptionsForSortingDropdown(newTab);
    setSelectedSortingOption('createdOn');
    setSortingDirection('ASC');
  }

  const handleSortDirectionChange = () => {
    const newSortingDirection = sortingDirection === 'ASC' ? 'DESC' : 'ASC';
    setSortingDirection(newSortingDirection);
    if (props.handleSortDirectionChange) {
      props.handleSortDirectionChange(newSortingDirection);
    }
  }

  useImperativeHandle(ref, () => ({
    turnOffRecentlyDoneButton, clearSearchInput, restartSorting
  }));

  const createOptionsForSortingDropdown = (tab) => {
    let sortingOptions = chooseProperSortKeys(tab).map((option) => 
        (
          <option className="select-option"
            key={option.value}
            value={option.value}
            disabled={option.value === ''}>
            {option.label}
          </option>
          )
      );
    setSortingOptions(sortingOptions)
  }


  const switchShowTitle = function (state) {
    if(props.switchShowTitle) {
      props.switchShowTitle(state);
      setShowTitle(state);
      localStorage.setItem('savedShowTitle', state);
    }
  };

  useEffect(() => {
    let savedShowTitle = localStorage.getItem('savedShowTitle');
    if(savedShowTitle) {
      setShowTitle(savedShowTitle === 'true');
    }
  }, [])

  return (
    <div className="toolbar" >
      <RegularButton text='Dodaj' icon={<AiOutlineAppstoreAdd/>} onClick={handleAddItem} disabled={recentlyDoneIsActive || props.waitingForSync} />
      <RegularButton text='Ostatnie' icon={<AiOutlineFileDone/>} onClick={handleRecentlyDone} isActive={recentlyDoneIsActive} />

      <select className="select-wrapper" value={selectedSortingOption} onChange={handleSortChange} disabled={recentlyDoneIsActive || props.waitingForSync} >
        {sortingOptions}
      </select>

      {sortingDirection === 'DESC' ? 
        <RegularButton text='Malejąco' icon={<BsSortDown/>} onClick={handleSortDirectionChange} disabled={recentlyDoneIsActive || props.waitingForSync} /> :
        <RegularButton text='Rosnąco' icon={<BsSortUp/>} onClick={handleSortDirectionChange} disabled={recentlyDoneIsActive || props.waitingForSync} />
      }
      <div className="input-with-select">
        <input type="text" className="search-input" value={searchInputValue} placeholder="Wyszukiwanie..." 
          disabled={recentlyDoneIsActive || props.waitingForSync} maxLength={15} onChange={handleSearchInputChange} />
          <select className="select-input" onChange={handleChangingPropertyToFind} value={propertyToFind} disabled={recentlyDoneIsActive || props.waitingForSync} >
            {chooseProperSearchProperty(props.activeTab).map((option) => (
              <option className="select-option" key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
      </div>

      <div className={'title-switch'}>
        <Switch onChange={switchShowTitle} checked={showTitle} offColor={'#3b3b3b'} onColor={'#21d810'} height={15} width={35} offHandleColor={'#ebebeb'} onHandleColor={'#ebebeb'} />
        Tytuły
      </div>

    </div>
  );
});


export default Toolbar;
