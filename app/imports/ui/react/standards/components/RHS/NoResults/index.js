import React from 'react';

import RHS from '../../../../components/RHS';

const StandardsRHSNoResults = () => (
  <RHS>
    <RHS.Card className="standard-details">
      <div className="card-block card-heading">
        <h5>Your search did not match any documents</h5>
      </div>
    </RHS.Card>
  </RHS>
);

export default StandardsRHSNoResults;
