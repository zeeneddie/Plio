import React from 'react';

import LHS from '../../../components/LHS';
import StandardsLHSSectionList from '../StandardsLHSSectionList';
import StandardsLHSTypeList from '../StandardsLHSTypeList';

const StandardsLHS = (props) => {
  let content;

  switch (props.filter) {
    case 1:
    default:
      content = (
        <StandardsLHSSectionList
          collapsed={props.collapsed}
          sections={props.sections}
          shouldCollapseOnMount={true}
          orgSerialNumber={props.orgSerialNumber}
          onToggleCollapse={props.onSectionToggleCollapse}
        />
      );
      break;
    case 2:
      content = (
        <StandardsLHSTypeList
          collapsed={props.collapsed}
          types={props.types}
          shouldCollapseOnMount={true}
          orgSerialNumber={props.orgSerialNumber}
          onTypeToggleCollapse={props.onTypeToggleCollapse}
          onSectionToggleCollapse={props.onSectionToggleCollapse}
        />
      );
      break;
  }

  return (
    <LHS
      searchText={props.searchText}
      searchResultsText={props.searchResultsText}
      onChange={props.onSearchTextChange}
    >
      {content}
    </LHS>
  );
};

export default StandardsLHS;
