import React from 'react';

import StandardListItemContainer from '../../containers/StandardListItemContainer';

const RisksList = (props) => (
  <div className="list-group">
    {props.risks.map(standard => {
      console.log(standard);
      return <div>RisksList</div>
      return (
        <StandardListItemContainer
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
      )
    })}
  </div>
);

export default RisksList;
