import { createSelector } from 'reselect';
import { map } from 'ramda';

import { getRisks } from './state';

const selector = map(({ _id, sequentialId, title }) => ({
  value: _id,
  text: `${sequentialId} ${title}`,
}));

export default createSelector(getRisks, selector);
