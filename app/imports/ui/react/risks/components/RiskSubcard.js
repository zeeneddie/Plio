import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle } from 'reactstrap';
import Blaze from 'meteor/gadicc:blaze-react-component';

import { Subcard } from '../../components';

const RiskSubcard = ({ risk, isOpen, toggle }) => (
  <Subcard {...{ isOpen, toggle }}>
    <Subcard.Header>
      <CardTitle>
        <strong>{risk.sequentialId}</strong>
        {' '}
        {risk.title}
      </CardTitle>
    </Subcard.Header>
    <Subcard.Body>
      <Blaze template="Risk_Subcard" {...{ risk }} />
    </Subcard.Body>
  </Subcard>
);

RiskSubcard.propTypes = {
  risk: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default RiskSubcard;
