import { PropTypes } from 'react';

import { default as headerPropTypes } from '../StandardsRHSHeaderButtons/propTypes';

export default {
  isFullScreenMode: PropTypes.bool,
  standard: PropTypes.object.isRequired,
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
};
