import React from 'react';

import LHSItem from '../../../components/LHSItem';

const createSectionItem = key => ({ key, type: 'find out where it is used' });

const HelpsLHSSectionList = (props) => (
  <div>
    {props.sections.map(section => (
        <LHSItem
          key={section.sectionKey}
          collapsed={[]}
          item={createSectionItem(section.sectionKey)}
          lText={section.sectionName}
          onToggleCollapse={() => {}}
        >
          <div></div>
        </LHSItem>
      ))}
  </div>
);

export default HelpsLHSSectionList;
