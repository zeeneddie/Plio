import { T } from 'ramda';
import { Roles } from 'meteor/alanning:roles';

import ensureCanBeVerified from '../ensureCanBeVerified';
import { UserRoles } from '../../../../share/constants';

describe('ensureCanBeVerified', () => {
  it('throws', () => {
    const args = {};
    const context = {
      userId: null,
      doc: {},
    };

    expect(() => ensureCanBeVerified()(T, args, context)).toThrow();
  });

  it('passes', () => {
    const args = {};
    const userId = 1;
    const organizationId = 3;
    const doc = {
      organizationId,
      isCompleted: true,
      isVerified: false,
      toBeVerifiedBy: 2,
    };
    const context = { userId, doc };

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    const actual = ensureCanBeVerified()(T, args, context);

    expect(actual).toBe(true);
  });
});
