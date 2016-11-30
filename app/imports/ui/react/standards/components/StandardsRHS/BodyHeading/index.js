import React from 'react';

import propTypes from './propTypes';

const StandardsRHSBodyHeading = ({ title, status, issueNumber }) => (
  <div className="flexbox-row">
    <h4 className="list-group-item-heading pull-left">
      <span>{title}</span>
      {status === 'draft' && (
        <span className="label label-danger margin-left">
          <span>{`Issue ${issueNumber}`} Draft</span>
        </span>
      )}
    </h4>
    <div className="flex"></div>
  </div>
);

StandardsRHSBodyHeading.propTypes = propTypes;

export default StandardsRHSBodyHeading;
