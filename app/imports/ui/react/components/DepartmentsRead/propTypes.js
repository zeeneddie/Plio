import { PropTypes } from 'react';

export default {
  departments: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.string,
};
