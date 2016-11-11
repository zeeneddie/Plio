import { PropTypes } from 'react';

export default {
  standard: PropTypes.shape({
    status: PropTypes.string,
    title: PropTypes.string,
    issueNumber: PropTypes.number,
  }).isRequired,
};
