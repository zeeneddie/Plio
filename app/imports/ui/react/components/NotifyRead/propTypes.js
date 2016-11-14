import { PropTypes } from 'react';

export default {
  users: PropTypes.arrayOf(PropTypes.oneOfType(PropTypes.string, PropTypes.object)),
};
