import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from './Button';
import { IconLoading } from '../Icons';

const SaveButton = ({
  color = 'secondary',
  className,
  isSaving,
  ...props
}) => (
  <Button
    color={color}
    className={cx({ disabled: isSaving }, className)}
    disabled={isSaving}
    {...props}
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
