import React from 'react';

import LHSItem from '../../../components/LHSItem';
import StandardsLHSStandardList from '../StandardsLHSStandardList';
import { createSectionItem } from '../../helpers';

const StandardsLHSSectionList = (props) => (
  <div>
    {props.sections.map(section => (
        <LHSItem
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

        </LHSItem>
      ))}
  </div>
);

export default StandardsLHSSectionList;
