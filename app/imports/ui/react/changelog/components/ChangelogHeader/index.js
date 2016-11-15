import React from 'react';

import propTypes from './propTypes';

const ChangelogHeader = (props) => (
  <div
    className={`card-footer card-changelog-toggle
      ${props.isChangelogCollapsed ? 'collapsed' : ''}
      ${(props.isLoadingLastHumanLog || props.isLoadingLastLogs) ? 'waiting' : '' }`}
  >
    <div className="row">
      <div className="col-xs-6">
        Created by: <span>{props.createdBy}</span>
        <br />
        Date: <span>{props.createdAt}</span>
      </div>
      {(props.updatedAt && props.updatedBy) ? (
        <div className="col-xs-6">
          Last edited by: <span>{props.updatedBy}</span>
          <br />
          Date: <span>{props.updatedAt}</span>
        </div>
      ) : ''}
    </div>
  </div>
);

ChangelogHeader.propTypes = propTypes;

export default ChangelogHeader;
