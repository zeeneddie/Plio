import React from 'react';

import LHSItem from '../../../components/LHSItem';
import StandardsLHSStandardList from '../StandardsLHSStandardList';
import MessagesCount from '../../../components/MessagesCount';
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
            <MessagesCount count={section.unreadMessagesCount} />
          )}
          hideRTextOnCollapse
          onToggleCollapse={props.onToggleCollapse}
        >

            <StandardsLHSStandardList
              standards={section.standards}
              section={section}
              orgSerialNumber={props.orgSerialNumber}
              userId={props.userId}
              filter={props.filter}
              urlItemId={props.urlItemId}
            />

        </LHSItem>
      ))}
  </div>
);

export default StandardsLHSSectionList;
