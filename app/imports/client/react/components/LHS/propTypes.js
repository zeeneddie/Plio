import PropTypes from 'prop-types';

export default {
  animating: PropTypes.bool,
  isFocused: PropTypes.bool,
  searchText: PropTypes.string,
  searchResultsText: PropTypes.string,
  children: PropTypes.node,
  onModalButtonClick: PropTypes.func,
  onClear: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};
