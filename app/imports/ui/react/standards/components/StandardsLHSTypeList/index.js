import React from 'react';

import LHSListItem from '../../../components/LHSListItem';
import StandardsLHSSectionList from '../StandardsLHSSectionList';
import { createTypeItem } from '../../helpers';

const StandardsLHSTypeList = (props) => (
  <div>
    {props.types.map(type => (
      <LHSListItem
        key={type._id}
        item={createTypeItem(type._id)}
        lText={type.title}
        collapsed={props.collapsed}
        onToggleCollapse={props.onTypeToggleCollapse}
      >

        <div className="sub">
          <StandardsLHSSectionList
            collapsed={props.collapsed}
            sections={type.sections}
            onToggleCollapse={props.onSectionToggleCollapse}
            orgSerialNumber={props.orgSerialNumber}
          />
        </div>

      </LHSListItem>
    ))}
  </div>
);

export default StandardsLHSTypeList;
