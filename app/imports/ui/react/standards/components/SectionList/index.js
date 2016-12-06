import React from 'react';

import LHSItemContainer from '../../../containers/LHSItemContainer';
import StandardListContainer from '../../containers/StandardListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import { createSectionItem } from '../../helpers';


const SectionList = (props) => (
  <div>
    {props.sections.map(section => (
      <LHSItemContainer
        key={section._id}
        item={createSectionItem(section._id)}
        lText={section.title}
        rText={section.unreadMessagesCount && (
          <LabelMessagesCount count={section.unreadMessagesCount} />
        )}
        hideRTextOnCollapse
        onToggleCollapse={props.onToggleCollapse}
      >

        <StandardListContainer
          standards={section.standards}
          section={section}
        />

      </LHSItemContainer>
      ))}
  </div>
);

export default SectionList;
