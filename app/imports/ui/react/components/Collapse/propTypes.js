import { PropTypes } from 'react';

export default {
  onToggleCollapse: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  classNames: PropTypes.shape({
    head: PropTypes.string,
    body: PropTypes.string,
    wrapper: PropTypes.string,
  }),
  children: PropTypes.node,
  onCollapseShow: PropTypes.func,
  onCollapseShown: PropTypes.func,
  onCollapseHide: PropTypes.func,
  onCollapseHidden: PropTypes.func,
};
