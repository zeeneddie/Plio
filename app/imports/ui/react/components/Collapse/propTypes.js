import { PropTypes } from 'react';

export default {
  onToggleCollapse: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  classNames: PropTypes.shape({
    head: PropTypes.string,
    body: PropTypes.string,
  }),
  children: PropTypes.node,
};
