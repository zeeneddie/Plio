import React from 'react';

import LHSItem from '../../../components/LHSItem';
import StandardsLHSSectionList from '../StandardsLHSSectionList';
import StandardsLHSStandardList from '../StandardsLHSStandardList';
import { createTypeItem } from '../../helpers';
import { lengthStandards } from '/imports/api/helpers';

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
          {lengthStandards(type) ? (
            <StandardsLHSStandardList
              standards={type.standards}
              orgSerialNumber={props.orgSerialNumber}
            />
          ) : (
            <StandardsLHSSectionList
              collapsed={props.collapsed}
              sections={type.sections}
              onToggleCollapse={props.onSectionToggleCollapse}
              orgSerialNumber={props.orgSerialNumber}
            />
          )}
        </div>
      </LHSItem>
    ))}
  </div>
);

export default StandardsLHSTypeList;
