import React from 'react';

import propTypes from './propTypes';

const StandardsRHSBodyHeading = (props) => (
  <h4 className="list-group-item-heading pull-left">
    <span>{props.standard.title}</span>
    {props.standard.status === 'draft' && (
      <span className="label label-danger">
        <span>{`Issue ${props.standard.issueNumber}`}</span>
        <span>Draft</span>
      </span>
    )}
  </h4>
);

StandardsRHSBodyHeading.propTypes = propTypes;

export default StandardsRHSBodyHeading;
