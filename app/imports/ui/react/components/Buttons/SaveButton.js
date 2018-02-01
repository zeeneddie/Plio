import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button';
import { IconLoading } from '../Icons';

const SaveButton = ({
  color = 'primary',
  isSaving,
  ...props
}) => (
  <Button
    disabled={isSaving}
    {...{ color, ...props }}
  >
    {isSaving && <IconLoading />}
    {isSaving ? 'Saving...' : 'Save'}
  </Button>
);

SaveButton.propTypes = {
  isSaving: PropTypes.bool,
  ...Button.propTypes,
};

export default SaveButton;
