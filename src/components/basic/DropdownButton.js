import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';

const DropdownButton = ({ options, initialOptions, placeholder, isMulti, onSelected, onDeselected }) => {

    const [selectedOptions, setSelectedOptions] = useState(initialOptions);
  
    const handleOptionChange = (selected) => {

        if(!isMulti) {
            onSelected(selected.value);
            setSelectedOptions([selected])
            return;
        }

        const deselectedList = selectedOptions.find(
            (prevOption) => !selected.some((selectedOption) => selectedOption.value === prevOption.value)
        );
        if (deselectedList) {
            onDeselected(deselectedList);
        }

        const newlySelectedList = selected.find(
        (selectedOption) => !selectedOptions.some((prevOption) => prevOption.value === selectedOption.value)
        );
        if (newlySelectedList) {
            onSelected(newlySelectedList);
        }

        setSelectedOptions(selected);
    };

    useEffect(() => {
        if(!isMulti) {
            setSelectedOptions('');
        }
    }, [options])

    const DropdownIndicator = (props) => {
        return (
          components.DropdownIndicator && (
            <components.DropdownIndicator {...props}>
              <svg width="8" height="5" viewBox="0 0 8 5" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 5L8 0.5L3.97336e-07 0.5L4 5Z" fill={"var(--almost_white)"} />
              </svg>
            </components.DropdownIndicator>
          )
        );
      };

    const customStyles = {
        control: (provided) => ({
        ...provided,
        backgroundColor: 'var(--background_color)',
        border: `2px solid transparent`,
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: 'none',
        minWidth: '127px',
        marginRight: '10px',
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
        singleValue: (provided) => ({
            ...provided,
            fontSize: '14px',
            color: 'var(--almost_white)',
          }),
        multiValueLabel: (provided) => ({
        ...provided,
        fontSize: '14px',
        color: 'var(--my_blue)',
        }),
        option: (provided) => ({
        ...provided,
        color: 'var(--almost_white)',
        fontSize: '14px',
        padding: '4px 4px 4px 4px',
        backgroundColor: 'var(--light_gray)',
        '&:hover': {
            backgroundColor: 'rgba(30, 144, 255)',
        },
        }),
        multiValueRemove: (provided) => ({
        ...provided,
        color: 'var(--almost_white)',
        transition: 'background-color 0.3s ease, color 0.3s ease'
        }),  
        menu: (provided) => ({
        ...provided,
        borderRadius: '0px',
        backgroundColor: 'transparent',
        maxWidth: '150px',
        minWidth: '150px', 
        marginTop: '-8px',
        right: 0,
        transform: 'translateX(0%)',
        }),
    };

    return (
        <Select
            isMulti={isMulti ? isMulti : false}
            value={selectedOptions}
            onChange={handleOptionChange}
            placeholder={placeholder}
            isClearable={false}
            isSearchable={false}
            styles={customStyles}
            options={options}
            components={{ DropdownIndicator }}
        />
    );
};

export default DropdownButton;
