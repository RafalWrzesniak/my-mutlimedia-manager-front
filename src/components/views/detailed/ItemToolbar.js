import '../../../css/item-toolbar.css';
import React, { useState, useEffect } from 'react';
import { addItemToList, findListsContainingProduct, removeItemFromList } from '../../api/MutlimediaManagerApi';
import { tabToApi } from '../../utils/Utils';
import RegularButton from '../../basic/RegularButton';
import { MdDone } from 'react-icons/md';
import DropdownButton from '../../basic/DropdownButton';

const ItemToolbar = ({ lists, item, refreshState }) => {
  
  const [initDropdownLists, setInitDropdownLists] = useState([]);
  const [renderDropdownButton, setRenderDropDownButton] = useState(false);
  
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
    fetchListsContainingItem();
  }, [item])

  useEffect(() => {
    fetchListsContainingItem();
  }, [])


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
      <RegularButton text='Ukończ' icon={<MdDone/>} />
    </div>
  );
};

export default ItemToolbar;
