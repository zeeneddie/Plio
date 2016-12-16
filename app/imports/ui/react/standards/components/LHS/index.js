import React from 'react';

import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';
import SectionListContainer from '../../containers/SectionListContainer';
import TypeListContainer from '../../containers/TypeListContainer';
import DeletedStandardListContainer from '../../containers/DeletedStandardListContainer';

const StandardsLHS = (props) => {
  let content;

  switch (props.filter) {
    case 1:
    default:
      content = (
        <SectionListContainer
          standards={props.standards}
          onToggleCollapse={props.onSectionToggleCollapse}
        />
      );
      break;
    case 2:
      content = (
        <TypeListContainer
          standards={props.standards}
          onToggleCollapse={props.onToggleCollapse}
        />
      );
      break;
    case 3:
      content = (
        <div className="list-group">
          <DeletedStandardListContainer standards={props.standards} />
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
