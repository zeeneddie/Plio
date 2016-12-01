import React, { PropTypes } from 'react';

import Label from '../Label';

const LabelDraft = ({ issueNumber, margin }) => (
  <Label names="danger" margin={margin}>
    {`Issue ${issueNumber} Draft`}
  </Label>
);

LabelDraft.propTypes = {
  issueNumber: PropTypes.number.isRequired,
};

export default LabelDraft;
