import React, { PropTypes } from 'react';

import FormField from '../../../../../fields/edit/components/FormField';
import FormInput from '../../../../../forms/components/FormInput';

const OrgName = ({ name }) => (
  <FormField>
    <span>Org name</span>
    <FormInput readOnly disabled value={name} />
  </FormField>
);

OrgName.propTypes = {
  name: PropTypes.string.isRequired,
};

export default OrgName;
