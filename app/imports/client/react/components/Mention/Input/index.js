import React from 'react';
import { Input, DropdownToggle } from 'reactstrap';

const MentionInput = props => (
  <DropdownToggle
    tag="div"
    data-toggle="dropdown"
  >
    <Input {...props} />
  </DropdownToggle>
);

export default MentionInput;
