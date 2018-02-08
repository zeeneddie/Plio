import { T } from 'ramda';
import { Roles } from 'meteor/alanning:roles';

import ensureCanBeCompleted from '../ensureCanBeCompleted';
import { UserRoles } from '../../../../share/constants';

describe('ensureCanBeCompleted', () => {
  it('throws', async () => {
    const root = {};
    const args = {};
    const context = {
      userId: null,
      doc: {},
    };

    await expect(ensureCanBeCompleted()(T, root, args, context)).rejects.toEqual(expect.any(Error));
  });

  it('passes', async () => {
    const root = {};
    const args = {};
    const userId = 1;
    const organizationId = 3;
    const doc = {
      isCompleted: false,
      isVerified: false,
      toBeCompletedBy: 2,
      organizationId,
    };
    const context = { userId, doc };

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    const actual = await ensureCanBeCompleted()(T, root, args, context);

    expect(actual).toBe(true);
  });
});
