import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';
import ClearField from '../../fields/read/components/ClearField';
import AddButton from '../Buttons/AddButton';
import TextInput from '../../forms/components/TextInput';
import Icon from '../Icons/Icon';

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
        <div
          className={cx(
            'form-group',
            'row',
            'with-loader',
            { loading: animating }
          )}
        >
          <ClearField
            onClick={e => onClear && onClear(searchInput)(e)}
            animating={animating}
            isFocused={isFocused}
          >
            <TextInput
              value={searchText}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              disabled={animating}
              refCb={input => (searchInput = input)}
              className="form-control"
              placeholder="Search..."
            />
          </ClearField>

          {animating && (
            <Icon name="circle-o-notch spin" className="small-loader" />
          )}
        </div>
        {onModalButtonClick && (
          <AddButton onClick={onModalButtonClick}>
            Add
          </AddButton>
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
