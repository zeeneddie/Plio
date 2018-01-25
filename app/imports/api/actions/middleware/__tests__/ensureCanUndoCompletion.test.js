import { T } from 'ramda';
import { Roles } from 'meteor/alanning:roles';

import ensureCanUndoCompletion from '../ensureCanUndoCompletion';
import { UserRoles } from '../../../../share/constants';

describe('ensureCanUndoCompletion', () => {
  it('throws', () => {
    const args = {};
    const context = {
      userId: null,
      doc: {},
    };

    expect(() => ensureCanUndoCompletion()(T, args, context)).toThrow();
  });

  it('passes', () => {
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

    const actual = ensureCanUndoCompletion()(T, args, context);

    expect(actual).toBe(true);
  });
});
