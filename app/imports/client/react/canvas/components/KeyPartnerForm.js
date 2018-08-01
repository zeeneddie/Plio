import PropTypes from 'prop-types';
import React from 'react';
import { noop } from 'plio-util';

import { FormField } from '../../components';
import CriticalityField from './CriticalityField';
import CanvasForm from './CanvasForm';

const KeyPartnerForm = ({
  organizationId,
  save = noop,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Criticality
      <CriticalityField name="criticality" onChange={criticality => save({ criticality })} />
    </FormField>
    <FormField>
      Level of spend
      <CriticalityField name="levelOfSpend" onChange={levelOfSpend => save({ levelOfSpend })} />
    </FormField>
  </CanvasForm>
);

KeyPartnerForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default KeyPartnerForm;
