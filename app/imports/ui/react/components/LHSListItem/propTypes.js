import { PropTypes } from 'react';

const item = PropTypes.shape({
  key: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}).isRequired;

export default {
  item,
  collapsed: PropTypes.arrayOf(item).isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  children: PropTypes.node,
  lText: PropTypes.string.isRequired,
  rText: PropTypes.string,
};
