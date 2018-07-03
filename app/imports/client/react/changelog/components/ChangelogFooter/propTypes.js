import PropTypes from 'prop-types';

export default {
  logsCount: PropTypes.number,
  isLoadingAllLogs: PropTypes.bool,
  isAllLogsLoaded: PropTypes.bool,
  isLoadingLogsCount: PropTypes.bool,
  showAll: PropTypes.bool,
  lastLogsLimit: PropTypes.number,
  onViewAllClick: PropTypes.func,
  onViewRecentClick: PropTypes.func,
};
