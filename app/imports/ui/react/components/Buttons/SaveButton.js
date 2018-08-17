import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import { IconLoading } from '../Icons';

const SaveButton = ({
  color = 'primary',
  isSaving,
  children = 'Save',
  ...props
}) => (
  <Button
    disabled={isSaving}
    {...{ color, ...props }}
  >
    {isSaving && <IconLoading />}
    {isSaving ? 'Saving...' : children}
  </Button>
);

SaveButton.propTypes = {
  isSaving: PropTypes.bool,
  children: PropTypes.node,
  ...Button.propTypes,
};

export default SaveButton;
