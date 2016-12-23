import React, { PropTypes } from 'react';

import Button from '../Button';
import Icon from '../../Icon';

const ClearButton = ({ onClick, animating }) => (
  <Button
    type="link"
    className="clear-field"
    tabIndex="-1"
    onClick={onClick}
  >
    {animating ? (
      <Icon names="spinner pulse fw" margin="bottom" />
    ) : (
      <Icon names="times-circle" />
    )}
  </Button>
);

ClearButton.propTypes = {
  animating: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ClearButton;
