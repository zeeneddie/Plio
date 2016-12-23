import { PropTypes } from 'react';

export default {
  animating: PropTypes.bool,
  searchText: PropTypes.string,
  searchResultsText: PropTypes.string,
  onSearchTextChange: PropTypes.func,
  onClear: PropTypes.func,
  organizations: PropTypes.arrayOf(PropTypes.object),
  onToggleCollapse: PropTypes.func,
};
