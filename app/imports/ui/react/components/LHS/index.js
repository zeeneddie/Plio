import React from 'react';

import ClearableField from '../ClearableField';

const LHS = ({
  animating = false,
  isFocused = false,
  searchText = '',
  searchResultsText = '',
  children,
  onModalButtonClick,
  onClear,
  onFocus,
  onBlur,
  onChange,
}) => {
  let searchInput;

  return (
    <div className="card">
      <div className="search-form">
        <div className={`form-group row with-loader ${animating ? 'loading' : ''}`}>
          <ClearableField
            onClick={e => onClear && onClear(searchInput)(e)}
            animating={animating}
            isFocused={isFocused}
          >
            <input
              ref={input => (searchInput = input)}
              type="text"
              className="form-control"
              placeholder="Search..."
              disabled={animating}
              defaultValue={searchText}
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={onChange}
            />
          </ClearableField>
          
          {animating && (
            <i className="small-loader fa fa-circle-o-notch fa-spin"></i>
          )}
        </div>
        {onModalButtonClick && (
          <button
            className="btn btn-primary"
            onClick={onModalButtonClick}
          >
            <i className="fa fa-plus"></i>
            <span>Add</span>
          </button>
        )}
      </div>

      <div className="list-group list-group-accordion">
        {children}

        {searchResultsText && (
          <div
            className="list-group-item list-group-subheading search-results-meta text-muted"
          >
            {searchResultsText}
          </div>
        )}
      </div>
    </div>
  );
};

export default LHS;
