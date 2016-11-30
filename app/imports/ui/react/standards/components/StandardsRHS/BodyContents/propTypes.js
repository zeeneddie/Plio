import { PropTypes } from 'react';

export default {
  description: PropTypes.string,
  issueNumber: PropTypes.number,
  owner: PropTypes.string,
  departmentsIds: PropTypes.arrayOf(PropTypes.string),
  source1: PropTypes.object,
  source2: PropTypes.object,
  section: PropTypes.object,
  type: PropTypes.object,
  files: PropTypes.arrayOf(PropTypes.object),
};
