import React from 'react';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { AiOutlineFieldTime } from 'react-icons/ai';
import '../../css/item.css';
import { formatDate } from '../Utils';


const Item = ({ product, isActive, onItemClick }) => {

  const handleClick = () => {
    onItemClick();
  };

  const getFinishedOn = () => {
    const date = product.readOn || product.watchedOn || product.finishedOn;
    if (date) {
      return formatDate(date);
    }
    return '';
  };

  return (
    <div className='wholeItem'>
      <div className="item-button-wrapper">
        <button className={`item-button ${isActive ? 'active' : ''}`} onClick={handleClick}>
          <div className="item-image" style={{ backgroundImage: `url(${product.imagePath})` }}>
            <div className={`item-overlay${product.polishTitle || product.studio ? '-static' : ''}`}>
              <span className="item-title">
                {product.polishTitle ? product.polishTitle : product.title}
              </span>
            </div>
          </div>
        </button>
        {(product.readOn || product.watchedOn || product.finishedOn) && (
          <div className="item-info">
            <div className="item-finished-icon">
              <IoCheckmarkDoneSharp />
            </div>
            <label className="item-finished-on">{getFinishedOn()}</label>
          </div>
        )}
        {product.playedHours && (
          <div className="item-info">
            <div className="item-finished-icon">
              <AiOutlineFieldTime />
            </div>
            <label className="item-finished-on">{product.playedHours} godzin</label>
          </div>
        )}
      </div>
    </div>

  );
}

export default Item;
