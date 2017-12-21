import { createSelector } from 'reselect';
import { map } from 'ramda';

import { getStandards } from './state';

const selector = map(({ _id, title }) => ({
  value: _id,
  text: title,
}));

export default createSelector(getStandards, selector);
