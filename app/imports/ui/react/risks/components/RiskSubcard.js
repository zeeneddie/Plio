import React from 'react';
import PropTypes from 'prop-types';
import Blaze from 'meteor/gadicc:blaze-react-component';
import cx from 'classnames';

import { Subcard, Button, CardBlock } from '../../components';

const RiskSubcard = ({
  risk,
  isOpen,
  toggle,
  onDelete,
  onClose,
  isSaving,
}) => (
  <Subcard {...{ isOpen, toggle }}>
    {/* id is needed for scrolling */}
    <Subcard.Header id={`subcard-${risk._id}`}>
      <span>
        <strong>{risk.sequentialId}</strong>
        {' '}
        {risk.title}
      </span>
    </Subcard.Header>
    <Subcard.Body>
      <Blaze template="Risk_Subcard" {...{ risk }} />
      <CardBlock>
        <Button
          color="secondary"
          pull="right"
          className={cx({ disabled: isSaving })}
          onClick={e => !isSaving && onClose({ risk, isOpen, toggle }, e)}
        >
          Close
        </Button>
        <Button
          color="secondary"
          pull="left"
          onClick={e => !isSaving && onDelete({ risk, isOpen, toggle }, e)}
        >
          Delete
        </Button>
      </CardBlock>
    </Subcard.Body>
  </Subcard>
);

RiskSubcard.propTypes = {
  risk: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
};

export default RiskSubcard;
