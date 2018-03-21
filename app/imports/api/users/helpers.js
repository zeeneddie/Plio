import property from 'lodash.property';
import { converge, assocPath, identity } from 'ramda';

import { SystemName } from '../../share/constants';
import { compose, every, chain, join, either, trim } from '../helpers';

export const getFirstName = property('profile.firstName');

export const getLastName = property('profile.lastName');

export const isCompletedRegistration = every([getFirstName, getLastName]);

export const getEmail = property('emails[0].address');

export const getAvatar = property('profile.avatar');

export const getFullName = compose(
  trim,
  join(' '),
  chain(getFirstName, getLastName),
);

const isUserSystem = user => typeof user === 'string' && user === SystemName && user;

export const getFullNameOrEmail = either(isUserSystem, either(getFullName, getEmail));

export const getUserWithFullName = converge(assocPath(['profile', 'fullName']), [
  getFullName,
  identity,
]);
