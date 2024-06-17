import '../../../css/item-toolbar.css';
import React, { useState, useEffect } from 'react';
import { addItemToList, finishItem, removeItemFromList, setBookFormat, setGamePlatform } from '../../api/MultimediaManagerApi';
import { formatDate, getFinishedOn, isBook, isGame, isMovie, itemToApi, tabToApi } from '../../utils/Utils';
import RegularButton from '../../basic/RegularButton';
import { MdDone } from 'react-icons/md';
import DropdownButton from '../../basic/DropdownButton';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import moment from 'moment';
import { IoIosCloseCircleOutline } from "react-icons/io";


const ItemToolbar = ({ lists, item, addItemToListId, removeItemFromListId, updateItem, closeDetails, refreshListsInApp }) => {
  
  const [initDropdownLists, setInitDropdownLists] = useState([]);
  const [selectedBookFormat, setSelectedBookFormat] = useState('');
  const [selectedGamePlatform, setSelectedGamePlatform] = useState('');
  const [finishedOnDate, setFinishedOnDate] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [renderDropdownButton, setRenderDropDownButton] = useState(false);
  const [showingFinishButton, setShowingFinishButton] = useState(false);
  
  const listMappedToOptions = lists.map((list) => ({ value: list.id, label: list.name, listType: list.listType }));

  const addItemToListFunc = (list) => {
    addItemToList(item.id, list.value, tabToApi(list.listType))
    addItemToListId(item, list.value)
  };

  const removeItemFromListFunc = (list) => {
    removeItemFromList(item.id, list.value, tabToApi(list.listType))
    removeItemFromListId(item, list.value)
  };
    
  useEffect(() => {
    setRenderDropDownButton(false);
    setShowingFinishButton(false);
    setFinishedOnDate(getFinishedOn(item) ? getFinishedOn(item) : moment().format("YYYY-MM-DD"))
    setTimeSpent(item.playedHours ? item.playedHours : '')
    setListsThatContainsItem();
    setSelectedBookFormat(item.bookFormat ? item.bookFormat : '')
    setSelectedGamePlatform(item.userGamePlatform ? item.userGamePlatform : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])
 
  const changeBookFormat = (event) => {
    let newBookFormat = event.target.value;
    setSelectedBookFormat(newBookFormat);
    setBookFormat(item.id, newBookFormat)
  }

  const changeGamePlatform = (event) => {
    let newGamePlatform = event.target.value;
    setSelectedGamePlatform(newGamePlatform);
    setGamePlatform(item.id, newGamePlatform)
  }

  const showFinishingButton = () => {
    setShowingFinishButton(true);
  }

  const handleFinishOnChange = (event) => {
    setFinishedOnDate(event.target.value)
  }  

  const handleTimeSpentChange = (event) => {
    let newValue = event.target.value;
    if(newValue.length < 5) {
      setTimeSpent(newValue)
    }
  }  
  
  const acceptFinishedOn = async () => {
    if(finishedOnDate !== getFinishedOn(item) || timeSpent !== item.playedHours) {
      await finishItem(item.id, finishedOnDate, timeSpent, itemToApi(item));
      item.finishedOn = finishedOnDate;
      if(isBook(item)) {
        item.readOn = finishedOnDate;
      } else if(isMovie(item)) {
        item.watchedOn = finishedOnDate;
      }
      if(timeSpent && timeSpent !== item.playedHours) {
        item.playedHours = timeSpent;
      }
      updateItem(item);
      refreshListsInApp();
    }    
    setShowingFinishButton(false)
  }

  const setListsThatContainsItem = () => {
    let foundLists = lists.filter(list => list.allItems.map(listItem => listItem.id).includes(item.id))
    let mappedLists = foundLists.map((list) => ({ value: list.id, label: list.name, listType: list.listType }));
    setInitDropdownLists(mappedLists);
    setRenderDropDownButton(true);
  }

  if(initDropdownLists.length === 0) {
    setListsThatContainsItem();
  }  

  return (
    <div className="item-toolbar">
      <div className='horizontal-container'>
        {(renderDropdownButton) &&
            (<DropdownButton
                options={listMappedToOptions}
                initialOptions={initDropdownLists}
                placeholder='Wybierz liste'
                isMulti={true}
                onSelected={addItemToListFunc}
                onDeselected={removeItemFromListFunc}
            />)
        }
        <IoIosCloseCircleOutline className='close-detailed' onClick={closeDetails}/>
      </div>
      <div className='horizontal-container'>
          {(!showingFinishButton && getFinishedOn(item)) && (<RegularButton onClick={showFinishingButton} text={formatDate(getFinishedOn(item))} extraStyle='always-big' icon={<IoCheckmarkDoneSharp style={ {color: 'var(--my_green)'} }/>} />)}
          {(!showingFinishButton && !getFinishedOn(item)) && (<RegularButton onClick={showFinishingButton} text='Ukończ' extraStyle='always-big' icon={<MdDone/>} />)}
          {(!showingFinishButton && item.playedHours) && (<div onClick={showFinishingButton} className='finish-hours'>{`${item.playedHours}h`}</div>)}  

          {(showingFinishButton) && (
            <div className='horizontal-container-small'>
              <input className='finish-date-input' maxLength={10} type="date" value={finishedOnDate} onChange={handleFinishOnChange} />
              {(isGame(item)) && (
                <input className='finish-date-time' placeholder='czas' type="number" value={timeSpent} onChange={handleTimeSpentChange} />                
              )}
              <MdDone className='finish-icon' onClick={acceptFinishedOn} />
            </div>
          )}

            {(isBook(item)) && (
              <select className="select-wrapper" value={selectedBookFormat} onChange={changeBookFormat} >
                <option hidden={true} value='' className="select-option">Format...</option>
                <option value='Paper' className="select-option">Papier</option>
                <option value='Digital' className="select-option">E-book</option>
              </select>
            )} 
            {(isGame(item)) && (
              <select className="select-wrapper" value={selectedGamePlatform} onChange={changeGamePlatform} >
                <option hidden={true} value='' className="select-option">Platforma...</option>
                <option value='PS5' className="select-option">Playstation 5</option>
                <option value='PC' className="select-option">PC</option>
              </select>
            )} 
       
        </div>
      
    </div>
  );
};

export default ItemToolbar;
