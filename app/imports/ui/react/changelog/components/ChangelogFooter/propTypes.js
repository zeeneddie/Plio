import { PropTypes } from 'react';

export default {
  logsCount: PropTypes.number,
  isLoadingAllLogs: PropTypes.bool,
  isAllLogsLoaded: PropTypes.bool,
  isLoadingLogsCount: PropTypes.bool,
  showAll: PropTypes.bool,
  onViewAllClick: PropTypes.func,
  onViewRecentClick: PropTypes.func,
};
