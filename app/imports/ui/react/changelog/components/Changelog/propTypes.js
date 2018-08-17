import PropTypes from 'prop-types';

export default {
  documentId: PropTypes.string,
  collection: PropTypes.string,
  isChangelogCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  onViewAllClick: PropTypes.func,
};
