import React from 'react';

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
    <div className="pagination">
      <button
        className='pagination-button'
        onClick={handlePreviousPage}
        disabled={currentPage === 0}
      >
        Wstecz
      </button>
      <span>
        {currentPage + 1} / {totalPages}
      </span>
      <button
        className='pagination-button'
        onClick={handleNextPage}
        disabled={currentPage === totalPages - 1}
      >
        Dalej
      </button>
    </div>
  );
};

export default Paginator;
