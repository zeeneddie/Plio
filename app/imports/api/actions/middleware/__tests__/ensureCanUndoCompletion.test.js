import { T } from 'ramda';
import { Roles } from 'meteor/alanning:roles';

import ensureCanUndoCompletion from '../ensureCanUndoCompletion';
import { UserRoles } from '../../../../share/constants';

describe('ensureCanUndoCompletion', async () => {
  it('throws', async () => {
    const root = {};
    const args = {};
    const context = {
      userId: null,
      doc: {},
    };

    await expect(ensureCanUndoCompletion()(T, root, args, context))
      .rejects
      .toEqual(expect.any(Error));
  });

  it('passes', async () => {
    const root = {};
    const args = {};
    const userId = 1;
    const organizationId = 3;
    const doc = {
      isCompleted: true,
      isVerified: false,
      completedAt: new Date(),
      completedBy: 2,
      organizationId,
    };
    const context = { userId, doc };

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    const actual = await ensureCanUndoCompletion()(T, root, args, context);

    expect(actual).toBe(true);
  });
});
