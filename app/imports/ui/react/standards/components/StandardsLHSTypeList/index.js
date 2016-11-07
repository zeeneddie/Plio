import React from 'react';

import LHSListItem from '../../../components/LHSListItem';
import StandardsLHSSectionList from '../StandardsLHSSectionList';

const StandardsLHSTypeList = (props) => (
  <div>
    {props.types.map(type => (
      <LHSListItem
        key={type._id}
        item={type}
        lText={type.title}
        collapsed={props.collapsed}
        shouldCollapseOnMount={props.shouldCollapseOnMount}
        onToggleCollapse={() => {}}>

        <div className="sub">
          <StandardsLHSSectionList
            sections={type.sections}
            shouldCollapseOnMount={true}
            onToggleCollapse={props.onToggleCollapse}
            orgSerialNumber={props.orgSerialNumber}/>
        </div>

      </LHSListItem>
    ))}
  </div>
);

export default StandardsLHSTypeList;
