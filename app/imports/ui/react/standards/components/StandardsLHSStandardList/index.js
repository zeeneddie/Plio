import React from 'react';

import StandardsLHSListItemContainer from '../../containers/StandardsLHSListItemContainer';

const StandardsLHSStandardList = (props) => (
  <div>
    {props.standards.map(standard => (
      <StandardsLHSListItemContainer
        key={standard._id}
        section={props.section}
        orgSerialNumber={props.orgSerialNumber}
        {...standard}/>
    ))}
  </div>
);

export default StandardsLHSStandardList;
