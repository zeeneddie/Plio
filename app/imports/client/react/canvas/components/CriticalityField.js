import React from 'react';

import { Criticality } from '../../../../share/constants';
import { SelectRadioField } from '../../components';

const options = [
  { label: 'Low', value: Criticality.LOW },
  { label: 'Medium', value: Criticality.MEDIUM },
  { label: 'High', value: Criticality.HIGH },
  { label: 'Very high', value: Criticality.VERY_HIGH },
];

const CriticalityField = props => (
  <SelectRadioField {...{ options, ...props }} />
);

export default CriticalityField;
