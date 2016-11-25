import React from 'react';

import propTypes from './propTypes';

const StandardsRHSBodyHeading = ({ title, status, issueNumber }) => (
  <h4 className="list-group-item-heading pull-left">
    <span>{title}</span>
    {status === 'draft' && (
      <span className="label label-danger">
        <span>{`Issue ${issueNumber}`}</span>
        <span>Draft</span>
      </span>
    )}
  </h4>
);

StandardsRHSBodyHeading.propTypes = propTypes;

export default StandardsRHSBodyHeading;
