import React from 'react';

import RisksListItemContainer from '../../containers/RisksListItemContainer';

const RisksList = (props) => (
  <div className="list-group">
    {props.risks.map(risk => (
      <RisksListItemContainer
        key={risk._id}
        section={props.section}
        orgSerialNumber={props.orgSerialNumber}
        organization={props.organization}
        userId={props.userId}
        filter={props.filter}
        urlItemId={props.urlItemId}
        _id={risk._id}
        type={risk.type}
        // {...risk}
      />
    ))}
  </div>
);

export default RisksList;
