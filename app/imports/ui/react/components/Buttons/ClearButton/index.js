import React, { PropTypes } from 'react';

import Button from '../Button';
import Icon from '../../Icon';

const ClearButton = ({ animating, ...other }) => (
  <Button
    type="link"
    className="clear-field"
    tabIndex="-1"
    {...other}
  >
    {animating ? (
      <Icon name="spinner pulse fw" margin="bottom" />
    ) : (
      <Icon name="times-circle" />
    )}
  </Button>
);

ClearButton.propTypes = {
  animating: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ClearButton;
