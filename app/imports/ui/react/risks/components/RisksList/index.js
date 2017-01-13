import React from 'react';

import RisksListItemContainer from '../../containers/RisksListItemContainer';

const RisksList = (props) => (
  <div className="list-group">
    {props.standards.map(standard => (
      <RisksListItemContainer
        key={standard._id}
        section={props.section}
        orgSerialNumber={props.orgSerialNumber}
        organization={props.organization}
        userId={props.userId}
        filter={props.filter}
        urlItemId={props.urlItemId}
        _id={standard._id}
        type={standard.type}
        // {...standard}
      />
    ))}
  </div>
);

export default StandardList;
