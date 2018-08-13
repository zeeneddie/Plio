import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';

import { FormField } from '../../components';
import CriticalityField from './CriticalityField';
import CanvasForm from './CanvasForm';

const KeyPartnerForm = ({
  organizationId,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Criticality
      <CriticalityField name="criticality" onChange={save} />
    </FormField>
    <FormField>
      Level of spend
      <CriticalityField name="levelOfSpend" onChange={save} />
    </FormField>
  </CanvasForm>
);

KeyPartnerForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default pure(KeyPartnerForm);
