import property from 'lodash.property';

import { SystemName } from '/imports/share/constants';
import { compose, every, chain, join, either, trim } from '/imports/api/helpers';

export const isCompletedRegistration = every([
  property('profile.firstName'),
  property('profile.lastName'),
]);

export const getFirstName = property('profile.firstName');

export const getLastName = property('profile.lastName');

export const getEmail = property('emails[0].address');

export const getAvatar = property('profile.avatar');

export const getFullName = compose(
  trim,
  join(' '),
  chain(getFirstName, getLastName)
);

const isUserSystem = (user) => typeof user === 'string' && user === SystemName && user;

export const getFullNameOrEmail = either(isUserSystem, either(getFullName, getEmail));
