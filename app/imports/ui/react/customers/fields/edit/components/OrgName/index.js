import PropTypes from 'prop-types';
import React from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';

import { FormField } from '../../../../../components';
import SequentialId from '../../../read/components/SequentialId';

const OrgName = ({ name, serialNumber }) => (
  <FormField>
    <span>Org name</span>
    <InputGroup>
      <InputGroupAddon>
        <SequentialId {...{ serialNumber }} />
      </InputGroupAddon>
      <Input readOnly disabled value={name} />
    </InputGroup>
  </FormField>
);

OrgName.propTypes = {
  name: PropTypes.string.isRequired,
  serialNumber: PropTypes.number.isRequired,
};

export default OrgName;
