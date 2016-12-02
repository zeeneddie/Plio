import React from 'react';

import propTypes from './propTypes';

const HelpDocsRHSBodyHeading = ({ title }) => (
  <h4 className="list-group-item-heading pull-left">
    <span>{title}</span>
  </h4>
);

HelpDocsRHSBodyHeading.propTypes = propTypes;

export default HelpDocsRHSBodyHeading;
