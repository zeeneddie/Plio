import React from 'react';

import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';
import StandardsLHSSectionList from '../StandardsLHSSectionList';
import StandardsLHSTypeList from '../StandardsLHSTypeList';
import StandardsLHSStandardListContainer from '../../containers/StandardsLHSStandardListContainer';

const StandardsLHS = (props) => {
  let content;

  switch (props.filter) {
    case 1:
    default:
      content = (
        <StandardsLHSSectionList
          sections={props.sections}
          onToggleCollapse={props.onSectionToggleCollapse}
        />
      );
      break;
    case 2:
      content = (
        <StandardsLHSTypeList
          types={props.types}
          onTypeToggleCollapse={props.onTypeToggleCollapse}
          onSectionToggleCollapse={props.onSectionToggleCollapse}
        />
      );
      break;
    case 3:
      content = (
        <div className="list-group">
          <StandardsLHSStandardListContainer standards={props.standards} />
        </div>
      );
      break;
  }

  return (
    <LHSContainer
      animating={props.animating}
      searchText={props.searchText}
      searchResultsText={props.searchResultsText}
      onChange={props.onSearchTextChange}
      onClear={props.onClear}
      onModalButtonClick={props.onModalOpen}
    >
      {content}
    </LHSContainer>
  );
};

StandardsLHS.propTypes = propTypes;

export default StandardsLHS;
