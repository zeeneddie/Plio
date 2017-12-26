import React from 'react';
import PropTypes from 'prop-types';
import Blaze from 'meteor/gadicc:blaze-react-component';
import { shouldUpdate } from 'recompose';
import { eqProps } from 'ramda';

import { Subcard } from '../../components';

const enhance = shouldUpdate((props, nextProps) => !!(
  props.isOpen !== nextProps.isOpen ||
  !eqProps('risk', props, nextProps)
));

const RiskSubcard = enhance(({ risk, isOpen, toggle }) => (
  <Subcard {...{ isOpen, toggle }}>
    <Subcard.Header>
      <span>
        <strong>{risk.sequentialId}</strong>
        {' '}
        {risk.title}
      </span>
    </Subcard.Header>
    <Subcard.Body>
      <div>
        <Blaze template="Risk_Subcard" {...{ risk }} />
      </div>
    </Subcard.Body>
  </Subcard>
));

RiskSubcard.propTypes = {
  risk: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default RiskSubcard;
