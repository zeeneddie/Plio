import { createSelector } from 'reselect';
import { sort } from 'ramda';
import { byProfileFirstName } from 'plio-util';

import { getUsers } from './state';

export default createSelector(getUsers, sort(byProfileFirstName));
