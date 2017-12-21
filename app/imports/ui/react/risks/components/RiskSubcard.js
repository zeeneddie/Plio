import React, { PropTypes } from 'react';

import Subcard from '../../components/Subcard';

const RiskSubcard = ({ risk, children, ...props }) => (
  <Subcard
    renderLeftContent={() => (
      <span>
        <strong>{risk.sequentialId}</strong>
        {' '}
        {risk.title}
      </span>
    )}
    {...props}
  >
    {children}
  </Subcard>
);

RiskSubcard.propTypes = {
  risk: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

export default RiskSubcard;
