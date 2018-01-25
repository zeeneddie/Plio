import { T } from 'ramda';
import { Roles } from 'meteor/alanning:roles';

import ensureCanUndoVerification from '../ensureCanUndoVerification';
import { UserRoles } from '../../../../share/constants';

describe('ensureCanUndoVerification', () => {
  it('throws', () => {
    const args = {};
    const context = {
      userId: null,
      doc: {},
    };

    expect(() => ensureCanUndoVerification()(T, args, context)).toThrow();
  });

  it('passes', () => {
    const args = {};
    const userId = 1;
    const organizationId = 3;
    const doc = {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: 2,
      organizationId,
    };
    const context = { userId, doc };

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    const actual = ensureCanUndoVerification()(T, args, context);

    expect(actual).toBe(true);
  });
});
