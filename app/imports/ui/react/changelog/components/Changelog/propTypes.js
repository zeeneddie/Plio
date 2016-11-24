import { PropTypes } from 'react';

export default {
  documentId: PropTypes.string,
  collection: PropTypes.string,
  isChangelogCollapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  onViewAllClick: PropTypes.func,
};
