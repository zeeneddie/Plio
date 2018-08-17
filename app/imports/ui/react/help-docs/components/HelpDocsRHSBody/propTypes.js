import PropTypes from 'prop-types';

export default {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  helpDoc: PropTypes.object,
  helpDocSection: PropTypes.object,
  file: PropTypes.object,
};
