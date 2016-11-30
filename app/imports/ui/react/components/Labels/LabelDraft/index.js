import React, { PropTypes } from 'react';

import Label from '../Label';

const LabelDraft = ({ issueNumber }) => (
  <Label names="danger">
    {`Issue ${issueNumber} Draft`}
  </Label>
);

LabelDraft.propTypes = {
  issueNumber: PropTypes.number.isRequired,
};

export default LabelDraft;
