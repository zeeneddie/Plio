import React from 'react';

import SelectRadioField from './SelectRadioField';
import { OrgCurrencies } from '../../../../share/constants';

const options = Object.values(OrgCurrencies).map(currency => ({
  label: currency,
  value: currency,
}));

const CurrencyRadioSelect = props => (
  <SelectRadioField {...props} options={options} />
);

export default CurrencyRadioSelect;
