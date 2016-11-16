import React from 'react';

import propTypes from './propTypes';
import ClearableField from '../ClearableField';
import AddButton from '../AddButton';

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
          <AddButton onClick={onModalButtonClick} />
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

LHS.propTypes = propTypes;

export default LHS;
