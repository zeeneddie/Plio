import React from 'react';

import LHSItemContainer from '../../../containers/LHSItemContainer';
import StandardsLHSStandardListContainer from '../../containers/StandardsLHSStandardListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import { createSectionItem } from '../../helpers';

const StandardsLHSSectionList = (props) => (
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

        <StandardsLHSStandardListContainer
          standards={section.standards}
          section={section}
        />

      </LHSItemContainer>
      ))}
  </div>
);

export default StandardsLHSSectionList;
