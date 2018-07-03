import React from 'react';

import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';
import CustomersTypeListContainer from '../../containers/TypeListContainer';

const CustomersLHS = ({
  animating,
  searchText,
  urlItemId,
  searchResultsText,
  onSearchTextChange,
  onClear,
  organizations,
  onToggleCollapse,
}) => (
  <LHSContainer
    {...{
      animating,
      searchText,
      searchResultsText,
      onClear,
      onChange: onSearchTextChange,
    }}
  >
    <CustomersTypeListContainer {...{ organizations, onToggleCollapse, urlItemId }} />
  </LHSContainer>
);

CustomersLHS.propTypes = propTypes;

export default CustomersLHS;
