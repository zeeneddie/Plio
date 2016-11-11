import { PropTypes } from 'react';

import { default as headerPropTypes } from '../StandardsRHSHeader/propTypes';

export default {
  isFullScreenMode: PropTypes.bool,
  standard: PropTypes.object.isRequired,
  collapsed: PropTypes.bool,
  isCardReady: PropTypes.bool,
  names: PropTypes.shape({
    headerNames: headerPropTypes.names,
  }),
  pathToDiscussion: PropTypes.string.isRequired,
  onModalOpen: PropTypes.func.isRequired,
  onDiscussionOpen: PropTypes.func.isRequired,
  onToggleScreenMode: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};
