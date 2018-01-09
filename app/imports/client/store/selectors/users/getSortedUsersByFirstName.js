import { createSelector } from 'reselect';
import { sort } from 'ramda';

import { getUsers } from './state';
import { byProfileFirstName } from '../../../util';

export default createSelector(getUsers, sort(byProfileFirstName));
