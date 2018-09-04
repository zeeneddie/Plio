import PropTypes from 'prop-types';

export default {
  file: PropTypes.object,
  hasDocxAttachment: PropTypes.bool,
  headerTitle: PropTypes.string,
  helpDoc: PropTypes.object,
  helpDocSection: PropTypes.object,
  isCardReady: PropTypes.bool,
  isFullScreenMode: PropTypes.bool,
  onToggleScreenMode: PropTypes.func,
  onModalOpen: PropTypes.func,
};
