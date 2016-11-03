import React from 'react';

const LHS = ({
  animating = false,
  searchText = '',
  searchResultsText = '',
  children,
  onModalButtonClick,
  onFocus = () => {},
  onChange = () => {},
}) => (
  <div className="card">
    <div className="search-form">
      <div className={`form-group row with-loader ${animating && 'loading'}`}>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          disabled={animating}
          defaultValue={searchText}
          onFocus={onFocus}
          onChange={onChange} />
        <i className="small-loader fa fa-circle-o-notch fa-spin"></i>
      </div>
      {onModalButtonClick && (
        <button
          className="btn btn-primary"
          onClick={onModalButtonClick}>
          <i className="fa fa-plus"></i>
          <span>Add</span>
        </button>
      )}
    </div>

    <div className="list-group list-group-accordion">
      {children}

      {searchText && (
        <div className="list-group-item list-group-subheading search-results-meta text-muted">{searchResultsText}</div>
      )}
    </div>
  </div>
);

export default LHS;
