import { T } from 'ramda';
import { Roles } from 'meteor/alanning:roles';

import ensureActionCanBeCompleted from '../ensureActionCanBeCompleted';
import { UserRoles } from '../../../../share/constants';

describe('ensureActionCanBeCompleted', () => {
  it('throws', async () => {
    const root = {};
    const args = {};
    const context = {
      userId: null,
      doc: {},
    };
    const promise = ensureActionCanBeCompleted()(T, root, args, context);

    await expect(promise).rejects.toEqual(expect.any(Error));
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

    const actual = await ensureActionCanBeCompleted()(T, root, args, context);

    expect(actual).toBe(true);
  });
});
