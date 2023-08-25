import '../../../css/item-toolbar.css';
import React, { useState, useEffect } from 'react';
import { addItemToList, findListsContainingProduct, finishItem, removeItemFromList, setBookFormat, setGamePlatform } from '../../api/MutlimediaManagerApi';
import { formatDate, getFinishedOn, isBook, isGame, itemToApi, tabToApi } from '../../utils/Utils';
import RegularButton from '../../basic/RegularButton';
import { MdDone } from 'react-icons/md';
import DropdownButton from '../../basic/DropdownButton';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import moment from 'moment';


const ItemToolbar = ({ lists, item, refreshState }) => {
  
  const [initDropdownLists, setInitDropdownLists] = useState([]);
  const [selectedBookFormat, setSelectedBookFormat] = useState('');
  const [selectedGamePlatform, setSelectedGamePlatform] = useState('');
  const [finishedOnDate, setFinishedOnDate] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [renderDropdownButton, setRenderDropDownButton] = useState(false);
  const [showingFinishButton, setShowingFinishButton] = useState(false);
  
  const listMappedToOptions = lists.map((list) => ({ value: list.name, label: list.name, listType: list.listType }));

  const addItemToListFunc = (list) => {
    console.log(`Dodaję do listy: '${list.value}' obiekt '${item.title}'`);
    addItemToList(item.id, list.value, tabToApi(list.listType), refreshState)
  };

  const removeItemFromListFunc = (list) => {
    console.log(`Usuwam z listy: '${list.value}' obiekt '${item.title}'`);
    removeItemFromList(item.id, list.value, tabToApi(list.listType), refreshState)
  };
  
  const fetchListsContainingItem = async () => {
    let foundLists = await findListsContainingProduct(item.id, tabToApi(lists[0].listType));
    let mappedLists = foundLists.map((list) => ({ value: list.name, label: list.name, listType: list.listType }));
    setInitDropdownLists(mappedLists);
    setRenderDropDownButton(true);
  }
  
  useEffect(() => {
    setRenderDropDownButton(false);
    setShowingFinishButton(false);
    setFinishedOnDate(getFinishedOn(item) ? getFinishedOn(item) : moment().format("YYYY-MM-DD"))
    setTimeSpent(item.playedHours ? item.playedHours : '')
    fetchListsContainingItem();
    setSelectedBookFormat(item.bookFormat ? item.bookFormat : '')
    setSelectedGamePlatform(item.userGamePlatform ? item.userGamePlatform : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])

  useEffect(() => {
    fetchListsContainingItem();
  })

  
  const changeBookFormat = (event) => {
    let newBookFormat = event.target.value;
    console.log(`Zmieniam format książki '${item.title}' na ${newBookFormat}`);
    setSelectedBookFormat(newBookFormat);
    setBookFormat(item.id, newBookFormat, refreshState)
  }

  const changeGamePlatform = (event) => {
    let newGamePlatform = event.target.value;
    console.log(`Zmieniam platformę gry '${item.title}' na ${newGamePlatform}`);
    setSelectedGamePlatform(newGamePlatform);
    setGamePlatform(item.id, newGamePlatform, refreshState)
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
  
  const acceptFinishedOn = () => {
    if(finishedOnDate !== getFinishedOn(item) || timeSpent !== item.playedHours) {
      console.log(`Setting item '${item.title}' as finished on ${finishedOnDate}${timeSpent ? ` in ${timeSpent} hours` : ''}`)
      finishItem(item.id, finishedOnDate, timeSpent, itemToApi(item), refreshState);
    }    
    setShowingFinishButton(false)
  }

  return (
    <div className="item-toolbar">
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
        <div className='horizontal-container'>
          {(!showingFinishButton && getFinishedOn(item)) && (<RegularButton onClick={showFinishingButton} text={formatDate(getFinishedOn(item))} icon={<IoCheckmarkDoneSharp style={ {color: 'var(--my_green)'} }/>} />)}
          {(!showingFinishButton && !getFinishedOn(item)) && (<RegularButton onClick={showFinishingButton} text='Ukończ' icon={<MdDone/>} />)}
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
