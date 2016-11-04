import React from 'react';

import LHSListItem from '../../../components/LHSListItem';
import StandardsLHSStandardList from '../StandardsLHSStandardList';

const StandardsLHSSectionList = (props) => (
  <div>
    {props.sections.map(section => (
        <LHSListItem
          key={section._id}
          item={section}
          lText={section.title}
          collapsed={section.collapsed}
          shouldCollapseOnMount={props.shouldCollapseOnMount}
          onToggleCollapse={props.onToggleCollapse}>

          <div className="list-group">
            <StandardsLHSStandardList
              standards={section.standards}
              section={section}
              orgSerialNumber={props.orgSerialNumber}/>
          </div>

        </LHSListItem>
      ))}
  </div>
);

export default StandardsLHSSectionList;
