import React from 'react';

import LHSItem from '../../../components/LHSItem';
import StandardsLHSSectionList from '../StandardsLHSSectionList';
import { createTypeItem } from '../../helpers';

const StandardsLHSTypeList = (props) => (
  <div>
    {props.types.map(type => (
      <LHSItem
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

      </LHSItem>
    ))}
  </div>
);

export default StandardsLHSTypeList;
