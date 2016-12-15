import React from 'react';

import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';
import CustomersTypeListContainer from '../../containers/TypeListContainer';

const CustomersLHS = (props) => (
  <LHSContainer
    animating={props.animating}
    searchText={props.searchText}
    searchResultsText={props.searchResultsText}
    onChange={props.onSearchTextChange}
    onClear={props.onClear}
  >
    <CustomersTypeListContainer
      organizations={props.organizations}
      onToggleCollapse={props.onToggleCollapse}
    />
  </LHSContainer>
);

CustomersLHS.propTypes = propTypes;

export default CustomersLHS;
