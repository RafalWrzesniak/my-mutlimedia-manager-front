import React from 'react';
import '../../../css/detailed-window.css';
import { formatDate, formatTime, listToString } from '../../utils/Utils';
import DetailedField from './DetailedField';
import ItemToolbar from './ItemToolbar';

const MovieDetailedWindow = ({ movie, tabLists, updateItem, addItemToListId, removeItemFromListId, closeDetails }) => {
  let sezonString = 'sezon'
  let seasonCount = movie.seriesInfo.seasonsCount;
  if(seasonCount > 1 && seasonCount < 5) {
    sezonString += 'y'
  } else if(seasonCount >= 5) {
    sezonString += 'ów'
  }
  return (
    <div className="detailed-window">
    <ItemToolbar item={movie} lists={tabLists} updateItem={updateItem} addItemToListId={addItemToListId} removeItemFromListId={removeItemFromListId} closeDetails={closeDetails} />
      <img className="image" src={movie.webImageUrl} alt="movie cover" />
      <div className="title">
        <a href={movie.filmwebUrl} target="_blank" rel="noopener noreferrer">
          {decodeURIComponent(movie.polishTitle)}
        </a>
      </div>
      <div className="detailed-fields">
        <DetailedField description="Oryginalny tytuł" value={movie.title} />
        <DetailedField description="Premiera" value={formatDate(movie.releaseDate)} />
        {(!movie.seriesInfo) && (<DetailedField description="Długość" value={formatTime(movie.runtimeMins)} />)}
        {(movie.seriesInfo) && (<DetailedField description="Serial" value={`${seasonCount} ${sezonString}, ${movie.seriesInfo.allEpisodesCount} odcinków`} />)}
        <DetailedField description="Ocena" value={`${movie.imDbRating} / ${movie.imDbRatingVotes}`} />
        <DetailedField description="Gatunek" value={listToString(movie.genreList)} />
        <DetailedField description="Produkcja" value={listToString(movie.countryList)} />
      </div>
      <DetailedField description="Opis" value={movie.plotLocal} justified={true}/>
    </div>
  );
};

export default MovieDetailedWindow;
