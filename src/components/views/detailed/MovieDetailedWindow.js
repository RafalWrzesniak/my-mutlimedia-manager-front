import React from 'react';
import '../../../css/detailed-window.css';
import { formatDate, formatTime, listToString } from '../../Utils';
import DetailedField from './DetailedField';
import ItemToolbar from './ItemToolbar';

const MovieDetailedWindow = ({ movie, tabLists, refreshState }) => {
  return (
    <div className="detailed-window">
    <ItemToolbar item={movie} lists={tabLists} refreshState={refreshState} />
      <img className="image" src={movie.imagePath} alt="movie cover" />
      <div className="title">
        <a href={movie.filmwebUrl} target="_blank" rel="noopener noreferrer">
          {movie.polishTitle}
        </a>
      </div>
      <div className="detailed-fields">
        <DetailedField description="Oryginalny tytuł" value={movie.title} />
        <DetailedField description="Premiera" value={formatDate(movie.releaseDate)} />
        <DetailedField description="Długość" value={formatTime(movie.runtimeMins)} />
        <DetailedField description="Ocena" value={`${movie.imDbRating} / ${movie.imDbRatingVotes}`} />
        <DetailedField description="Gatunek" value={listToString(movie.genreList)} />
        <DetailedField description="Produkcja" value={listToString(movie.countryList)} />
        {(movie.watchedOn) && (<DetailedField description="Oglądnięto" value={formatDate(movie.watchedOn)} />)}
      </div>
      <DetailedField description="Opis" value={movie.plotLocal} justified={true}/>
    </div>
  );
};

export default MovieDetailedWindow;
