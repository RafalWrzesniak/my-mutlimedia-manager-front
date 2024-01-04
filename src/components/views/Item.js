import React from 'react';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { AiOutlineFieldTime } from 'react-icons/ai';
import '../../css/item.css';
import { formatDate } from '../utils/Utils';

const Item = ({ product, isActive, onItemClick, showTitle }) => {

  const handleClick = () => {
    onItemClick();
  };

  const getFinishedOn = () => {
    const date = product.finishedOn || product.readOn || product.watchedOn;
    if (date) {
      return formatDate(date);
    }
    return '';
  };

  return (
    <div className='wholeItem'>
      <div className="item-button-wrapper">
        <button className={`item-button ${isActive ? 'active' : ''}`} onClick={handleClick}>
          <div className="item-image" style={{ backgroundImage: `url(${product.webImageUrl})` }}>
            {(product.id.includes('serial')) && (
            <div className={`serial-info${isActive ? '-active' : ''}`}>SERIAL</div>
            )}
            <div className={`item-overlay${showTitle ? '-static' : ''}`}>
              <span className={"item-title"}>
                {decodeURIComponent(product.polishTitle ? product.polishTitle : product.title)}
              </span>
            </div>
          </div>
        </button>
        {(product.finishedOn || product.readOn || product.watchedOn) && (
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
