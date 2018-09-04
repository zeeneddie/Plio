import React from 'react';

import propTypes from './propTypes';
import LabelDraft from '../../../../components/Labels/LabelDraft';

const StandardsRHSBodyHeading = ({ title, status, issueNumber }) => (
  <div className="flexbox-row">
    <h4 className="list-group-item-heading pull-left">
      <span>{title}</span>
      {status === 'draft' && issueNumber && (
        <LabelDraft issueNumber={issueNumber} margin="left" />
      )}
    </h4>
    <div className="flex" />
  </div>
);

StandardsRHSBodyHeading.propTypes = propTypes;

export default StandardsRHSBodyHeading;
