import React from 'react';

import { RiskFilterIndexes } from '/imports/api/constants';
import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';
import TypeListContainer from '../../containers/TypeListContainer';
import DepatrmentListContainer from '../../containers/DepatrmentListContainer';
import StatusListContainer from '../../containers/StatusListContainer';
import DeletedRisksListContainer from '../../containers/DeletedRisksListContainer';

const RisksLHS = (props) => {
  const contentByFilter = {
    [RiskFilterIndexes.TYPE]: (
      <TypeListContainer
        risks={props.risks}
        onToggleCollapse={props.onToggleCollapse}
      />
    ),
    [RiskFilterIndexes.STATUS]: (
      <StatusListContainer
        risks={props.risks}
        onToggleCollapse={props.onToggleCollapse}
      />
    ),
    [RiskFilterIndexes.DEPARTMENT]: (
      <DepatrmentListContainer
        risks={props.risks}
        onToggleCollapse={props.onToggleCollapse}
      />
    ),
    [RiskFilterIndexes.DELETED]: (
      <div className="list-group">
        <DeletedRisksListContainer risks={props.risks} />
      </div>
    ),
  };

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
