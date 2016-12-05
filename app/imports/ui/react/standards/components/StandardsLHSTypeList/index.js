import React from 'react';

import LHSItemContainer from '../../../containers/LHSItemContainer';
import StandardsLHSSectionList from '../StandardsLHSSectionList';
import StandardsLHSStandardListContainer from '../../containers/StandardsLHSStandardListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import { createTypeItem } from '../../helpers';
import { lengthStandards } from '/imports/api/helpers';

const StandardsLHSTypeList = (props) => (
  <div>
    {props.types.map(type => (
      <LHSItemContainer
        key={type._id}
        item={createTypeItem(type._id)}
        lText={type.title}
        rText={type.unreadMessagesCount && (
          <LabelMessagesCount count={type.unreadMessagesCount} />
        )}
        hideRTextOnCollapse
        onToggleCollapse={props.onTypeToggleCollapse}
      >
        <div className="sub">
          {lengthStandards(type) ? (
            <StandardsLHSStandardListContainer
              standards={type.standards}
            />
          ) : (
            <StandardsLHSSectionList
              sections={type.sections}
              onToggleCollapse={props.onSectionToggleCollapse}
            />
          )}
        </div>
      </LHSItemContainer>
    ))}
  </div>
);

export default StandardsLHSTypeList;
