import { T } from 'ramda';
import { Roles } from 'meteor/alanning:roles';

import ensureCanUndoActionVerification from '../ensureCanUndoActionVerification';
import { UserRoles } from '../../../../share/constants';

describe('ensureCanUndoActionVerification', () => {
  it('throws', async () => {
    const root = {};
    const args = {};
    const context = {
      userId: null,
    };

    await expect(ensureCanUndoActionVerification()(T, root, args, context))
      .rejects
      .toEqual(expect.any(Error));
  });

  it('passes', async () => {
    const args = {};
    const userId = 1;
    const organizationId = 3;
    const root = {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: 2,
      organizationId,
    };
    const context = { userId };

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    const actual = await ensureCanUndoActionVerification()(T, root, args, context);

    expect(actual).toBe(true);
  });
});
