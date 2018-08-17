import { createSelector } from 'reselect';
import { map } from 'ramda';

import { getUsers } from './state';
import { getFullNameOrEmail } from '../../../../api/users/helpers';

const selector = map(user => ({
  value: user._id,
  label: getFullNameOrEmail(user),
}));

export default createSelector(getUsers, selector);
