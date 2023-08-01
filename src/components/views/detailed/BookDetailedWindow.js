import React from 'react';
import '../../../css/detailed-window.css';
import { formatDate } from '../../Utils';
import DetailedField from './DetailedField';
import ItemToolbar from './ItemToolbar';

const BookDetailedWindow = ({ book, tabLists, refreshState }) => {
  return (
    <div className="detailed-window">
      <ItemToolbar item={book} lists={tabLists} refreshState={refreshState} />
      <img className="image" src={book.imagePath} alt="Book cover" />
      <div className="title">
        <a href={book.lubimyCzytacUrl} target="_blank" rel="noopener noreferrer">
          {book.title}
        </a>
      </div>
      <div className="detailed-fields">
        <DetailedField description="Autor" value={book.author.name} />
        <DetailedField description="Premiera" value={formatDate(book.datePublished)} />
        <DetailedField description="Strony" value={book.numberOfPages} />
        <DetailedField description="Wydawnictwo" value={book.publisher} />
        {(book.series) && (<DetailedField description="Seria" value={`${book.series.name} (tom ${book.series.position})`} />)}
        {(book.readOn) && (<DetailedField description="Przeczytano" value={formatDate(book.readOn)} />)}
        {(book.bookFormat) && (<DetailedField description="Format" value={book.bookFormat === 'Paper'? 'Papier' : 'E-book'} />)}
      </div>
      <DetailedField description="Opis" value={book.description} justified={true} />
    </div>
  );
};

export default BookDetailedWindow;
