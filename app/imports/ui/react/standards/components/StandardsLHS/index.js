import React from 'react';

import LHS from '../../../components/LHS';
import LHSListItem from '../../../components/LHSListItem';
import StandardsLHSListItemContainer from '../../containers/StandardsLHSListItemContainer';

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

        <div className="list-group">
          {section.standards.map((standard) => (
            <StandardsLHSListItemContainer
              key={standard._id}
              type={standard.type}
              section={section}
              orgSerialNumber={props.orgSerialNumber}
              {...standard}/>
          ))}
        </div>

      </LHSListItem>
    ))}
  </LHS>
);

export default StandardsLHS;
