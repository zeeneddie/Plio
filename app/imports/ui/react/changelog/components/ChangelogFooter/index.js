import React from 'react';

import propTypes from './propTypes';

const ChangelogFooter = (props) => (
  <div className="card-footer">
    {props.showAll ? (
      <a
        className="btn btn-secondary pointer"
        onClick={props.onViewRecentClick}
      >
        View {props.lastLogsLimit} recent changes
      </a>
    ) : (
      <a
        className={`btn btn-secondary pointer
          ${(props.logsCount <= props.lastLogsLimit) ? 'not-visible' : ''}`}
        onClick={props.onViewAllClick}
      >
        View all changes ({props.logsCount} total)
        {(props.isLoadingAllLogs || props.isLoadingLogsCount) ? (
          <i className="fa fa-spinner fa-pulse"></i>
        ) : ''}
      </a>
    )}
  </div>
);

ChangelogFooter.propTypes = propTypes;

export default ChangelogFooter;
