import PropTypes from 'prop-types';
import React from 'react';

import { getPath } from '/imports/ui/utils/router/paths';

const Unsubscribe = ({
  loading, error, orgSerialNumber, children,
}) => {
  if (loading) return (<span>Unsubscribing...</span>);

  return (
    <div>
      {error ? (<h3>Ooops... something went wrong!</h3>) : children}
      <a href={getPath('dashboardPage')({ orgSerialNumber })}>Open the dashboard</a>
    </div>
  );
};

Unsubscribe.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  orgSerialNumber: PropTypes.string,
  children: PropTypes.node,
};

export default Unsubscribe;
