import React from 'react';

import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';
import StandardsLHSSectionList from '../StandardsLHSSectionList';
import StandardsLHSTypeList from '../StandardsLHSTypeList';
import StandardsLHSStandardList from '../StandardsLHSStandardList';

const StandardsLHS = (props) => {
  let content;

  switch (props.filter) {
    case 1:
    default:
      content = (
        <StandardsLHSSectionList
          collapsed={props.collapsed}
          sections={props.sections}
          orgSerialNumber={props.orgSerialNumber}
          onToggleCollapse={props.onSectionToggleCollapse}
          userId={props.userId}
          filter={props.filter}
          urlItemId={props.urlItemId}
        />
      );
      break;
    case 2:
      content = (
        <StandardsLHSTypeList
          collapsed={props.collapsed}
          types={props.types}
          orgSerialNumber={props.orgSerialNumber}
          onTypeToggleCollapse={props.onTypeToggleCollapse}
          onSectionToggleCollapse={props.onSectionToggleCollapse}
          userId={props.userId}
          filter={props.filter}
          urlItemId={props.urlItemId}
        />
      );
      break;
    case 3:
      content = (
        <div className="list-group">
          <StandardsLHSStandardList
            standards={props.standards}
            orgSerialNumber={props.orgSerialNumber}
            userId={props.userId}
            filter={props.filter}
            urlItemId={props.urlItemId}
          />
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
