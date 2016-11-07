import React from 'react';

import LHS from '../../../components/LHS';
import LHSListItem from '../../../components/LHSListItem';
import StandardsLHSListItemContainer from '../../containers/StandardsLHSListItemContainer';
import StandardsLHSSectionList from '../StandardsLHSSectionList';
import StandardsLHSTypeList from '../StandardsLHSTypeList';

const StandardsLHS = (props) => {
  let content;

  switch(props.filter) {
    case 1:
    default:
      content = (
        <StandardsLHSSectionList
          sections={props.sections}
          shouldCollapseOnMount={true}
          onToggleCollapse={props.onToggleCollapse}
          orgSerialNumber={props.orgSerialNumber}/>
      );
      break;
    case 2:
      content = (
        <StandardsLHSTypeList
          types={props.types}
          shouldCollapseOnMount={true}
          orgSerialNumber={props.orgSerialNumber}
          onToggleCollapse={props.onToggleCollapse}/>
      );
      break;
  }

  return (
    <LHS
      searchText={props.searchText}
      searchResultsText={props.searchResultsText}
      onChange={props.onSearchTextChange}>
      {content}
    </LHS>
  );
};

export default StandardsLHS;
