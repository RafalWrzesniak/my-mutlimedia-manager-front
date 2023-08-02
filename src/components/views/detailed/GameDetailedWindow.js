import React from 'react';
import '../../../css/detailed-window.css';
import { formatDate, listToString } from '../../utils/Utils';
import DetailedField from './DetailedField';
import ItemToolbar from './ItemToolbar';

const GameDetailedWindow = ({ game, tabLists, refreshState }) => {
  return (
    <div className="detailed-window">
    <ItemToolbar item={game} lists={tabLists} refreshState={refreshState} />
      <img className="image" src={game.imagePath} alt="game cover" />
      <div className="title">
        <a href={game.gryOnlineUrl} target="_blank" rel="noopener noreferrer">
          {game.title}
        </a>
      </div>
      <div className="detailed-fields">
        <DetailedField description="Studio" value={game.studio} />
        <DetailedField description="Premiera" value={formatDate(game.releaseDate)} />
        <DetailedField description="Wydawca" value={game.publisher} />
        <DetailedField description="Ocena" value={`${game.ratingValue} / ${game.ratingCount}`} /> 
        <DetailedField description="Platformy" value={listToString(game.gamePlatform)} />
        <DetailedField description="Gatunek" value={listToString(game.genreList)} />
        {(game.finishedOn) && (<DetailedField description="Ukończono" value={formatDate(game.finishedOn)} />)}
        {(game.playedHours) && (<DetailedField description="Czas grania" value={`${game.playedHours}h`} />)}
        {(game.userGamePlatform) && (<DetailedField description="Platforma gracza" value={game.userGamePlatform} />)}
      </div>
      <DetailedField description="Opis" value={game.description} justified={true}/>
    </div>
  );
};

export default GameDetailedWindow;
