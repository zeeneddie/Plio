import PropTypes from 'prop-types';

export default {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  standard: PropTypes.object,
};
