import React, { PropTypes } from 'react';

import { getPath } from '/imports/ui/utils/router/paths';

const Unsubscribe = ({ loading, error, children }) => {
  if (loading) return (<span>Unsubscribing...</span>);

  return (
    <div>
      {!!error ? (<h3>Ooops... something went wrong!</h3>) : children}
      <a href={getPath('dashboardPage')()}>Open the dashboard</a>
    </div>
  );
};

Unsubscribe.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  children: PropTypes.node,
};

export default Unsubscribe;
