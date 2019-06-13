import { T } from 'ramda';
import { Roles } from 'meteor/alanning:roles';

import ensureActionCanBeVerified from '../ensureActionCanBeVerified';
import { UserRoles } from '../../../../share/constants';

describe('ensureActionCanBeVerified', () => {
  it('throws', async () => {
    const root = {};
    const args = {};
    const context = {
      userId: null,
    };
    const promise = ensureActionCanBeVerified()(T, root, args, context);

    await expect(promise).rejects.toEqual(expect.any(Error));
  });

  it('passes', async () => {
    const args = {};
    const userId = 1;
    const organizationId = 3;
    const root = {
      organizationId,
      isCompleted: true,
      isVerified: false,
      toBeVerifiedBy: 2,
    };
    const context = { userId };

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    const actual = await ensureActionCanBeVerified()(T, root, args, context);

    expect(actual).toBe(true);
  });
});
