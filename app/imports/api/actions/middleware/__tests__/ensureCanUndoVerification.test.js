import { T } from 'ramda';
import { Roles } from 'meteor/alanning:roles';

import ensureCanUndoVerification from '../ensureCanUndoVerification';
import { UserRoles } from '../../../../share/constants';

describe('ensureCanUndoVerification', () => {
  it('throws', async () => {
    const root = {};
    const args = {};
    const context = {
      userId: null,
      doc: {},
    };

    await expect(ensureCanUndoVerification()(T, root, args, context))
      .rejects
      .toEqual(expect.any(Error));
  });

  it('passes', async () => {
    const root = {};
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

    const actual = await ensureCanUndoVerification()(T, root, args, context);

    expect(actual).toBe(true);
  });
});
