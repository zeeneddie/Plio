import React from 'react';

import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';
import SectionList from '../SectionList';
import TypeList from '../TypeList';
import StandardListContainer from '../../containers/StandardListContainer';

const StandardsLHS = (props) => {
  let content;

  switch (props.filter) {
    case 1:
    default:
      content = (
        <SectionList
          sections={props.sections}
          onToggleCollapse={props.onSectionToggleCollapse}
        />
      );
      break;
    case 2:
      content = (
        <TypeList
          types={props.types}
          onTypeToggleCollapse={props.onTypeToggleCollapse}
          onSectionToggleCollapse={props.onSectionToggleCollapse}
        />
      );
      break;
    case 3:
      content = (
        <div className="list-group">
          <StandardListContainer standards={props.standards} />
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
