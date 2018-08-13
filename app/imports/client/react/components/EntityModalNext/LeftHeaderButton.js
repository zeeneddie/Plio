import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import { Button } from 'reactstrap';

import GuidanceIcon from '../GuidanceIcon';

const LeftHeaderButton = ({
  isEditMode,
  isGuidanceOpen,
  toggleGuidance,
  toggle,
}) => isEditMode ? (
  <GuidanceIcon isOpen={isGuidanceOpen} onClick={toggleGuidance} />
) : (
  <Button onClick={toggle}>Close</Button>
);

LeftHeaderButton.propTypes = {
  isEditMode: PropTypes.bool,
  isGuidanceOpen: PropTypes.bool.isRequired,
  toggleGuidance: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default pure(LeftHeaderButton);
