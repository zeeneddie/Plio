import React from 'react';

import { RiskFilterIndexes } from '/imports/api/constants';
import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';

const RisksLHS = (props) => {
  const contentByFilter = {
    [RiskFilterIndexes.TYPE]: <div>TYPE</div>,
    [RiskFilterIndexes.STATUS]: <div>STATUS</div>,
    [RiskFilterIndexes.DEPARTMENT]: <div>DEPARTMENT</div>,
    [RiskFilterIndexes.DELETED]: <div>DELETED</div>,
  };
  console.log(props);
  return (
    <LHSContainer
      animating={props.animating}
      searchText={props.searchText}
      searchResultsText={props.searchResultsText}
      onChange={props.onSearchTextChange}
      onClear={props.onClear}
      onModalButtonClick={props.onModalOpen}
    >
      {contentByFilter[props.filter]}
    </LHSContainer>
  );
};

RisksLHS.propTypes = propTypes;

export default RisksLHS;
