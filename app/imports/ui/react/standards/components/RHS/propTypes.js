import { PropTypes } from 'react';

import { default as headerPropTypes } from './HeaderButtons/propTypes';

export default {
  isFullScreenMode: PropTypes.bool,
  standard: PropTypes.object,
  isCardReady: PropTypes.bool,
  names: PropTypes.shape({
    headerNames: headerPropTypes.names,
  }),
  pathToDiscussion: PropTypes.string,
  onModalOpen: PropTypes.func,
  onDiscussionOpen: PropTypes.func,
  onToggleScreenMode: PropTypes.func,
  onRestore: PropTypes.func,
  onDelete: PropTypes.func,
};
