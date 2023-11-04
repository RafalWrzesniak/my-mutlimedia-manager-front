import React from 'react';
import Item from './Item';

const Content = ({ items, activeItem, onItemChange }) => {
  
  const handleItemClick = (item) => {
    onItemChange(item);
  };

  return (
    <div className="content">
      {items.map((item) => (
        <div key={item.id} className="item">
          <Item
            product={item}
            isActive={activeItem ? item.id === activeItem.id : false}
            onItemClick={() => handleItemClick(item)}
          />
        </div>
      ))}
    </div>
  );
};

export default Content;