import React from 'react';
import ReactPaginate from 'react-paginate';
import './styles.css';

interface Props {
  maxPageIndex: number,
  onChange:(index: number)=>void
}
function AppPagination (props: Props) {
  const { maxPageIndex, onChange } = props;

  const handlePageClick = data => {
    const { selected } = data;
    onChange(selected);
  };

  return (
    <ReactPaginate
      previousLabel={'← Previous'}
      nextLabel={'Next →'}
      breakLabel={<span className="gap">...</span>}
      breakClassName={'break-me'}
      pageCount={maxPageIndex + 1}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={'pagination'}
      subContainerClassName={'pages pagination'}
      activeClassName={'active'}
    />
  );
}

export default React.memo(AppPagination);
