import React from 'react';
import '../../css/regular-button.css';

const RegularButton = ({ text, icon, onClick, disabled, isActive, extraStyle }) => {

    return (
        <button 
            onClick={onClick} 
            className={`regular-button${extraStyle ? `-${extraStyle}` : ""}${isActive ? "-actived" : ""}`}
            disabled={disabled}>

            {icon && (<div className='button-icon'>{icon}</div>)}
            {text}
        </button>  
    );
  }
  
  export default RegularButton;