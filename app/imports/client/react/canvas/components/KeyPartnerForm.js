import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';

import { FormField, SliderField } from '../../components';
import { CriticalityLabels } from '../../../../api/constants';
import CanvasForm from './CanvasForm';

const sliderLabels = {
  leftLabel: CriticalityLabels.LOW,
  rightLabel: CriticalityLabels.HIGH,
};

const KeyPartnerForm = ({
  organizationId,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Criticality
      <SliderField
        {...sliderLabels}
        name="criticality"
        onAfterChange={save}
      />
    </FormField>
    <FormField>
      Level of spend
      <SliderField
        {...sliderLabels}
        name="levelOfSpend"
        onAfterChange={save}
      />
    </FormField>
  </CanvasForm>
);

KeyPartnerForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default pure(KeyPartnerForm);
