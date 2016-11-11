import { PropTypes } from 'react';

export default {
  standard: PropTypes.shape({
    status: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    issueNumber: PropTypes.number,
  }).isRequired,
};
