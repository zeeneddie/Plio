import { PropTypes } from 'react';

export default {
  classNames: PropTypes.shape({
    lhs: PropTypes.string,
    rhs: PropTypes.string,
  }),
  displayRHS: PropTypes.bool,
  children: PropTypes.node,
};
