import React from 'react';

import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';
import CustomersTypeListContainer from '../../containers/TypeListContainer';

const CustomersLHS = ({
  animating,
  searchText,
  searchResultsText,
  onSearchTextChange,
  onClear,
  organizations,
  onToggleCollapse,
}) => (
  <LHSContainer {...{ animating, searchText, searchResultsText, onSearchTextChange, onClear }}>
    <CustomersTypeListContainer {...{ organizations, onToggleCollapse }} />
  </LHSContainer>
);

CustomersLHS.propTypes = propTypes;

export default CustomersLHS;
