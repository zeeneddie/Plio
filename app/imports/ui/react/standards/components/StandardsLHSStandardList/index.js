import React from 'react';

import StandardsLHSListItemContainer from '../../containers/StandardsLHSListItemContainer';

const StandardsLHSStandardList = (props) => (
  <div className="list-group">
    {props.standards.map(standard => (
      <StandardsLHSListItemContainer
        key={standard._id}
        section={props.section}
        orgSerialNumber={props.orgSerialNumber}
        userId={props.userId}
        filter={props.filter}
        urlItemId={props.urlItemId}
        {...standard}
      />
    ))}
  </div>
);

export default StandardsLHSStandardList;
