import PropTypes from 'prop-types';

export default {
  animating: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  isFocused: PropTypes.bool,
  children: PropTypes.node,
};
