import React from 'react';

import LHSItem from '../../../components/LHSItem';
import StandardsLHSSectionList from '../StandardsLHSSectionList';
import StandardsLHSStandardListContainer from '../../containers/StandardsLHSStandardListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import { createTypeItem } from '../../helpers';
import { lengthStandards } from '/imports/api/helpers';

const StandardsLHSTypeList = (props) => (
  <div>
    {props.types.map(type => (
      <LHSItem
        key={type._id}
        item={createTypeItem(type._id)}
        lText={type.title}
        rText={type.unreadMessagesCount && (
          <LabelMessagesCount count={type.unreadMessagesCount} />
        )}
        hideRTextOnCollapse
        collapsed={props.collapsed}
        onToggleCollapse={props.onTypeToggleCollapse}
      >
        <div className="sub">
          {lengthStandards(type) ? (
            <StandardsLHSStandardListContainer
              standards={type.standards}
            />
          ) : (
            <StandardsLHSSectionList
              collapsed={props.collapsed}
              sections={type.sections}
              onToggleCollapse={props.onSectionToggleCollapse}
            />
          )}
        </div>
      </LHSItem>
    ))}
  </div>
);

export default StandardsLHSTypeList;
