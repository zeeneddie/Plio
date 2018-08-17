import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';

const ChangelogFooter = props => (
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
        onClick={props.onViewAllClick}
        className={cx(
          'btn btn-secondary pointer',
          {
            'not-visible': props.logsCount <= props.lastLogsLimit,
          },
        )}
      >
        View all changes ({props.logsCount} total)
        {(props.isLoadingAllLogs || props.isLoadingLogsCount) ? (
          <i className="fa fa-spinner fa-pulse" />
        ) : ''}
      </a>
    )}
  </div>
);

ChangelogFooter.propTypes = propTypes;

export default ChangelogFooter;
