import { PropTypes } from 'react';

export default {
  ncs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    sequentialId: PropTypes.string,
    status: PropTypes.number,
    href: PropTypes.string,
    indicator: PropTypes.string,
  })).isRequired,
};
