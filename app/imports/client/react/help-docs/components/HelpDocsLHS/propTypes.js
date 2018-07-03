import PropTypes from 'prop-types';

export default {
  animating: PropTypes.bool,
  collapsed: PropTypes.array,
  onClear: PropTypes.func,
  onModalOpen: PropTypes.func,
  onSearchTextChange: PropTypes.func,
  onToggleCollapse: PropTypes.func,
  sections: PropTypes.array,
  searchResultsText: PropTypes.string,
  searchText: PropTypes.string,
};
