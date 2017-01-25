import { PropTypes } from 'react';

export default {
  description: PropTypes.string,
  owner: PropTypes.string,
  departmentsIds: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.object,
  files: PropTypes.arrayOf(PropTypes.object),
};
