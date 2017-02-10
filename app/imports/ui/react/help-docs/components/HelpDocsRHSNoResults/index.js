import React from 'react';

import RHS from '../../../components/RHS';

const HelpDocsRHSNoResults = () => (
  <RHS flex>
    <RHS.Card className="standard-details">
      <div className="card-block card-heading">
        <h5>Your search did not match any help documents</h5>
      </div>
    </RHS.Card>
  </RHS>
);

export default HelpDocsRHSNoResults;
