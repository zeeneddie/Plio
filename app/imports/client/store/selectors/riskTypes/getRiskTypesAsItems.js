import { createSelector } from 'reselect';
import { map } from 'ramda';

import { getRiskTypes } from './state';

const selector = map(({ _id, title }) => ({
  value: _id,
  text: title,
}));

export default createSelector(getRiskTypes, selector);
