import React, { Fragment } from 'react';

export default Component => props => (
  <Fragment>
    <hr />
    <Component {...props} />
  </Fragment>
);
