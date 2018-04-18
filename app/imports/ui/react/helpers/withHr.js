import React from 'react';

export default Component => props => (
  <div>
    <hr />
    <Component {...props} />
  </div>
);
