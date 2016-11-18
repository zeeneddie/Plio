import { PropTypes } from 'react';

export default {
  names: PropTypes.shape({
    header: PropTypes.string.isRequired,
    discuss: PropTypes.string.isRequired,
    edit: PropTypes.string.isRequired,
    restore: PropTypes.string.isRequired,
    delete: PropTypes.string.isRequired,
  }).isRequired,
  isReady: PropTypes.bool,
  hasDocxAttachment: PropTypes.bool,
  isDiscussionOpened: PropTypes.bool,
  isDeleted: PropTypes.bool,
  hasAccess: PropTypes.bool,
  hasFullAccess: PropTypes.bool,
  onToggleScreenMode: PropTypes.func,
  pathToDiscussion: PropTypes.string,
  onDiscussionOpen: PropTypes.func,
  messagesNotViewedCount: PropTypes.number,
  onRestore: PropTypes.func,
  onDelete: PropTypes.func,
  onModalOpen: PropTypes.func,
};
