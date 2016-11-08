import { PropTypes } from 'react';

export default {
  animating: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  isFocused: PropTypes.bool,
  children: PropTypes.node,
};
