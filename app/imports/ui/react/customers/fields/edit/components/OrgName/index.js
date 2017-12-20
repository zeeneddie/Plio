import React, { PropTypes } from 'react';

import { FormField, FormInput } from '../../../../../components';
import SequentialId from '../../../read/components/SequentialId';

const OrgName = ({ name, serialNumber }) => (
  <FormField>
    <span>Org name</span>
    <FormInput readOnly disabled value={name}>
      <div className="input-group-addon">
        <SequentialId {...{ serialNumber }} />
      </div>
    </FormInput>
  </FormField>
);

OrgName.propTypes = {
  name: PropTypes.string.isRequired,
  serialNumber: PropTypes.number.isRequired,
};

export default OrgName;
