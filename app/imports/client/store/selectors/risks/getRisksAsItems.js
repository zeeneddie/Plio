import { createSelector } from 'reselect';
import { map } from 'ramda';

import { getRisks } from './state';

export const selector = map(({ _id, sequentialId, title }) => ({
  value: _id,
  label: `${sequentialId} ${title}`,
}));

export default createSelector(getRisks, selector);
