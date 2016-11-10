import { PropTypes } from 'react';

import { default as headerPropTypes } from '../StandardsRHSHeader/propTypes';

export default {
  isFullScreenMode: PropTypes.bool,
  standard: PropTypes.object.isRequired,
  collapsed: PropTypes.bool,
  toggleCollapse: PropTypes.func,
  isCardReady: PropTypes.bool,
  names: PropTypes.shape({
    headerNames: headerPropTypes.names,
  }),
};
