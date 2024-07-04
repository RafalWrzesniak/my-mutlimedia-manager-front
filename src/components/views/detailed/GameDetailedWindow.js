import React from 'react';
import '../../../css/detailed-window.css';
import { formatDate, listToString } from '../../utils/Utils';
import DetailedField from './DetailedField';
import ItemToolbar from './ItemToolbar';

const GameDetailedWindow = ({ game, tabLists, updateItem, addItemToListId, removeItemFromListId, closeDetails }) => {
  return (
    <div className="detailed-window">
    <ItemToolbar item={game} lists={tabLists} updateItem={updateItem} addItemToListId={addItemToListId} removeItemFromListId={removeItemFromListId} closeDetails={closeDetails} />
      <img className="image" src={game.webImageUrl} alt="game cover" />
      <div className="title">
        <a href={game.gryOnlineUrl} target="_blank" rel="noopener noreferrer">
          {decodeURIComponent(game.title)}
        </a>
      </div>
      <div className="detailed-fields">
        <DetailedField description="Studio" value={game.studio} />
        <DetailedField description="Premiera" value={formatDate(game.releaseDate)} />
        <DetailedField description="Wydawca" value={game.publisher} />
        <DetailedField description="Ocena" value={`${game.ratingValue} / ${game.ratingCount}`} /> 
        <DetailedField description="Platformy" value={listToString(game.gamePlatform)} />
        <DetailedField description="Gatunek" value={listToString(game.genreList)} />
      </div>
      <DetailedField description="Opis" value={game.description} justified={true}/>
    </div>
  );
};

export default GameDetailedWindow;
