import React from 'react';

import LHSItemContainer from '../../../containers/LHSItemContainer';
import SectionList from '../SectionList';
import StandardListContainer from '../../containers/StandardListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import { createTypeItem } from '../../helpers';
import { lengthStandards } from '/imports/api/helpers';
import SectionListContainer from '../../containers/SectionListContainer';

const TypeList = (props) => (
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
          <SectionListContainer
            onToggleCollapse={props.onSectionToggleCollapse}
            standards={type.standards}
          />
          {/* {lengthStandards(type) ? (
            <StandardListContainer
              standards={type.standards}
            />
          ) : (
            <SectionList
              sections={type.sections}
              onToggleCollapse={props.onSectionToggleCollapse}
            />
          )} */}
        </div>
      </LHSItemContainer>
    ))}
  </div>
);

export default TypeList;
