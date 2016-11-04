import React from 'react';

import LHS from '../../../components/LHS';
import LHSListItem from '../../../components/LHSListItem';
import StandardsLHSListItemContainer from '../../containers/StandardsLHSListItemContainer';

const StandardsLHS = (props) => (
  <LHS
    searchText={props.searchText}
    searchResultsText={props.searchResultsText}
    onChange={props.onSearchTextChange}>
    {props.sections.map(section => (
      <LHSListItem
        key={section._id}
        item={section}
        lText={section.title}
        collapsed={section.collapsed}
        shouldUpdate={props.shouldUpdate}
        shouldCollapseOnMount={!props.isCollapsedOnMount}
        onMount={props.onMount}
        onToggleCollapse={props.onToggleCollapse}>

        <div className="list-group">
          {section.standards.map(standard => (
            <StandardsLHSListItemContainer
              key={standard._id}
              section={section}
              orgSerialNumber={props.orgSerialNumber}
              {...standard}/>
          ))}
        </div>

      </LHSListItem>
    ))}
  </LHS>
);

export default StandardsLHS;
