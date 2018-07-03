import React from 'react';

import LabelDraft from '../../../components/Labels/LabelDraft';
import propTypes from './propTypes';

const HelpDocsRHSBodyHeading = props => (
  <div className="flexbox-row">
    <h4 className="list-group-item-heading pull-left">
      <span>{props.title}</span>

      {(props.status === 'draft' && props.issueNumber && props.userHasChangeAccess) ? (
        <LabelDraft issueNumber={props.issueNumber} margin="left" />
      ) : ''}
    </h4>
  </div>
);

HelpDocsRHSBodyHeading.propTypes = propTypes;

export default HelpDocsRHSBodyHeading;
