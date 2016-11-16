import React from 'react';

import LHSListItem from '../../../components/LHSListItem';
import StandardsLHSStandardList from '../StandardsLHSStandardList';
import { createSectionItem } from '../../helpers';

const StandardsLHSSectionList = (props) => (
  <div>
    {props.sections.map(section => (
        <LHSListItem
          key={section._id}
          collapsed={props.collapsed}
          item={createSectionItem(section._id)}
          lText={section.title}
          onToggleCollapse={props.onToggleCollapse}>

          <div className="list-group">
            <StandardsLHSStandardList
              standards={section.standards}
              section={section}
              orgSerialNumber={props.orgSerialNumber}/>
          </div>

        </LHSListItem>
      ))}
  </div>
);

export default StandardsLHSSectionList;
