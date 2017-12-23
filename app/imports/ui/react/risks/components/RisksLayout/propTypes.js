import PropTypes from 'prop-types';

export default {
  filters: PropTypes.object.isRequired,
  filter: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  onHandleFilterChange: PropTypes.func,
  onHandleReturn: PropTypes.func,
};
