import { T } from 'ramda';
import { Roles } from 'meteor/alanning:roles';

import ensureCanUndoActionCompletion from '../ensureCanUndoActionCompletion';
import { UserRoles } from '../../../../share/constants';

describe('ensureCanUndoActionCompletion', () => {
  it('throws', async () => {
    const root = {};
    const args = {};
    const context = {
      userId: null,
    };

    await expect(ensureCanUndoActionCompletion()(T, root, args, context))
      .rejects
      .toEqual(expect.any(Error));
  });

  it('passes', async () => {
    const args = {};
    const userId = 1;
    const organizationId = 3;
    const root = {
      isCompleted: true,
      isVerified: false,
      completedAt: new Date(),
      completedBy: 2,
      organizationId,
    };
    const context = { userId };

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    const actual = await ensureCanUndoActionCompletion()(T, root, args, context);

    expect(actual).toBe(true);
  });
});
