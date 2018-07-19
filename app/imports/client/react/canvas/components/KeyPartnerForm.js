import PropTypes from 'prop-types';
import React from 'react';

import { FormField } from '../../components';
import CriticalityField from './CriticalityField';
import CanvasForm from './CanvasForm';

const KeyPartnerForm = ({ organizationId }) => (
  <CanvasForm {...{ organizationId }}>
    <FormField>
      Criticality
      <CriticalityField name="criticality" />
    </FormField>
    <FormField>
      Level of spend
      <CriticalityField name="levelOfSpend" />
    </FormField>
  </CanvasForm>
);

KeyPartnerForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default KeyPartnerForm;
