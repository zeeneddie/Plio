import PropTypes from 'prop-types';

export default {
  organizations: PropTypes.arrayOf(PropTypes.object),
  onToggleCollapse: PropTypes.func,
};
