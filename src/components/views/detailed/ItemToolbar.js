import '../../../css/item-toolbar.css';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { addItemToList, findListsContainingProduct, removeItemFromList } from '../../MutlimediaManagerApi';
import { tabToApi } from '../../Utils';

const ItemToolbar = ({ lists, item, refreshState }) => {

  const [selectedOptions, setSelectedOptions] = useState([]);
  
    const options = lists.map((list) => ({ value: list.name, label: list.name, listType: list.listType }));

    useEffect(() => {
      const fetchListsContainingItem = async () => {
        let foundLists = await findListsContainingProduct(item.id, tabToApi(lists[0].listType));
        let mappedLists = foundLists.map((list) => ({ value: list.name, label: list.name, listType: list.listType }));
        setSelectedOptions(mappedLists)
      }
      fetchListsContainingItem();
    }, [item]);

    const handleOptionChange = (selected) => {
      const deselectedList = selectedOptions.find(
        (prevOption) => !selected.some((selectedOption) => selectedOption.value === prevOption.value)
      );
      if (deselectedList) {
        console.log(`Usuwam z listy: '${deselectedList.value}' obiekt '${item.title}'`);
        removeItemFromList(item.id, deselectedList.value, tabToApi(deselectedList.listType), refreshState)
      }

      const newlySelectedList = selected.find(
        (selectedOption) => !selectedOptions.some((prevOption) => prevOption.value === selectedOption.value)
      );
      if (newlySelectedList) {
        console.log(`Dodaję do listy: '${newlySelectedList.value}' obiekt '${item.title}'`);
        addItemToList(item.id, newlySelectedList.value, tabToApi(newlySelectedList.listType), refreshState)
      }

      setSelectedOptions(selected);
    };

    const customStyles = {
      control: (provided, state) => ({
        ...provided,
        backgroundColor: 'var(--background_color)',
        border: '2px solid transparent',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: state.isFocused ? 'none' : provided.boxShadow,
        '&:hover': {},
        '&:focus': {},
      }),
      multiValue: (provided) => ({
        ...provided,
        border: '2px solid transparent',
        borderRadius: '5px',
        backgroundColor: 'var(--light_gray)',
        padding: '4px 1px 4px 4px'
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: 'var(--my_blue)',
      }),
      option: (provided, state) => ({
        ...provided,
        color: 'var(--almost_white)',
        fontSize: '12px',
        backgroundColor: 'var(--some_gray)',
        '&:hover': {
          backgroundColor: 'var(--primary_blue)',
        },
      }),
      multiValueRemove: (provided) => ({
        ...provided,
        color: 'var(--almost_white)',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: 'var(--light_gray)',
      }),
    };

    return (
      <div className="item-toolbar">
        <Select
          isMulti={true}
          value={selectedOptions}
          onChange={handleOptionChange}
          placeholder="Wybierz listę"
          isClearable={false}
          styles={customStyles}
          options={options}
        />
        <div className="completion-button">
          <button>Ukończ</button>
        </div>
      </div>
    );
};

export default ItemToolbar;
