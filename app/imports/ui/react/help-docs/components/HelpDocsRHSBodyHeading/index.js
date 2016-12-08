import React from 'react';

import LabelDraft from '../../../components/Labels/LabelDraft';
import propTypes from './propTypes';

const HelpDocsRHSBodyHeading = ({ title, status, issueNumber }) => (
  <div className="flexbox-row">
    <h4 className="list-group-item-heading pull-left">
      <span>{title}</span>

      {status === 'draft' && issueNumber ? (
        <LabelDraft issueNumber={issueNumber} margin="left" />
      ) : ''}
    </h4>
  </div>
);

HelpDocsRHSBodyHeading.propTypes = propTypes;

export default HelpDocsRHSBodyHeading;
