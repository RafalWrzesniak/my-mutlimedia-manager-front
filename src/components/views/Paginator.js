import React from 'react';
import RegularButton from '../RegularButton';

const Paginator = ({ totalPages, currentPage, onPageChange }) => {

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="horizontal-container-center">
      <RegularButton text='Wstecz' onClick={handlePreviousPage} disabled={currentPage === 0} extraStyle='small' />
      <span>
        {currentPage + 1} / {totalPages}
      </span>
      <RegularButton text='Dalej' onClick={handleNextPage} disabled={currentPage === totalPages - 1} extraStyle='small' />
    </div>
  );
};

export default Paginator;
