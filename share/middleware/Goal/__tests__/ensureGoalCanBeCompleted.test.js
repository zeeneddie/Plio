import { Roles } from 'meteor/alanning:roles';
import { T } from 'ramda';

import ensureGoalCanBeCompleted from '../ensureGoalCanBeCompleted';
import { UserRoles } from '../../../../share/constants';
import Errors from '../../../errors';

describe('ensureGoalCanBeCompleted', () => {
  it('throws', async () => {
    const root = {};
    const args = {};
    const context = {
      userId: null,
    };
    const promise = ensureGoalCanBeCompleted()(T, root, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.DOC_CANNOT_BE_COMPLETED));
  });

  it('passes', async () => {
    const args = {};
    const userId = 1;
    const organizationId = 3;
    const root = {
      isCompleted: false,
      organizationId,
    };
    const context = { userId };

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    const promise = ensureGoalCanBeCompleted()(T, root, args, context);

    await expect(promise).resolves.toBe(true);
  });
});
