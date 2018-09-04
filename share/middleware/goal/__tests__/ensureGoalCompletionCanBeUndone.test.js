import { Roles } from 'meteor/alanning:roles';
import { T } from 'ramda';

import ensureGoalCompletionCanBeUndone from '../ensureGoalCompletionCanBeUndone';
import { UserRoles } from '../../../../share/constants';
import Errors from '../../../errors';

describe('ensureGoalCompletionCanBeUndone', () => {
  it('throws', async () => {
    const root = {};
    const args = {};
    const context = {
      userId: null,
    };
    const promise = ensureGoalCompletionCanBeUndone()(T, root, args, context);

    await expect(promise).rejects.toEqual(new Error(Errors.DOC_CANNOT_UNDO_COMPLETION));
  });

  it('passes', async () => {
    const args = {};
    const userId = 1;
    const organizationId = 2;
    const root = {
      organizationId,
      isCompleted: true,
      completedAt: new Date(),
      completedBy: 1,
    };
    const context = { userId };

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    const promise = ensureGoalCompletionCanBeUndone()(T, root, args, context);

    await expect(promise).resolves.toBe(true);
  });
});
