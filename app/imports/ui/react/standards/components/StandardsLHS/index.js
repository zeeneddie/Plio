import React from 'react';

import LHS from '../../../components/LHS';
import LHSListItem from '../../../components/LHSListItem';

const StandardsLHS = (props) => (
  <LHS>
    {props.sections.map((section) => (
      <LHSListItem
        key={section._id}
        item={section}
        lText={section.title}
        collapsed={section.collapsed}
        onCollapseShown={props.onCollapseShown}
        onCollapseHidden={props.onCollapseHidden}>
        {section.standards.map((standard) => (
          <li key={standard._id}>{standard.title}</li>
        ))}
      </LHSListItem>
    ))}
  </LHS>
);

export default StandardsLHS;
