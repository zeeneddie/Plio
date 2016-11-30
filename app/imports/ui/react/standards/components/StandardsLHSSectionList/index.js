import React from 'react';

import LHSItem from '../../../components/LHSItem';
import StandardsLHSStandardListContainer from '../../containers/StandardsLHSStandardListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import { createSectionItem } from '../../helpers';

const StandardsLHSSectionList = (props) => (
  <div>
    {props.sections.map(section => (
        <LHSItem
          key={section._id}
          collapsed={props.collapsed}
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

        </LHSItem>
      ))}
  </div>
);

export default StandardsLHSSectionList;
