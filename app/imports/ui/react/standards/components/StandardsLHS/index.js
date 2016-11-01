import React from 'react';

import LHS from '../../../components/LHS';
import LHSListItem from '../../../components/LHSListItem';

const StandardsLHS = (props) => (
  <LHS>
    {props.sections.map((section) => (
      <LHSListItem
        key={section._id}
        lText={section.title}>
        {props.standards.map((standard) => (
          <li key={standard._id}>{standard.title}</li>
        ))}
      </LHSListItem>
    ))}
  </LHS>
);

export default StandardsLHS;
