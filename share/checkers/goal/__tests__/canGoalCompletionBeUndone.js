import { Roles } from 'meteor/alanning:roles';
import moment from 'moment-timezone';

import { UserRoles, ActionUndoTimeInHours } from '../../../../share/constants';
import canGoalCompletionBeUndone from '../canGoalCompletionBeUndone';

describe('canGoalCompletionBeUndone', () => {
  afterEach(() => Roles.__clear());

  it('returns false if is not completed', () => {
    const userId = 1;
    const goal = {
      isCompleted: false,
    };

    expect(canGoalCompletionBeUndone(goal, userId)).toBe(false);
  });

  it('returns false if completedAt is not a date', () => {
    const userId = 1;
    const goal = {
      isCompleted: true,
      completedAt: null,
    };

    expect(canGoalCompletionBeUndone(goal, userId)).toBe(false);
  });

  it('returns false if undo deadline is overdue', () => {
    const userId = 1;
    const goal = {
      isCompleted: true,
      completedAt: moment(new Date()).subtract(ActionUndoTimeInHours).toDate(),
    };

    expect(canGoalCompletionBeUndone(goal, userId)).toBe(false);
  });

  it('returns true if the user has a role to complete any action', () => {
    const userId = 1;
    const organizationId = 3;
    const goal = {
      isCompleted: true,
      isVerified: false,
      completedAt: new Date(),
      completedBy: 2,
      organizationId,
    };
    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    expect(canGoalCompletionBeUndone(goal, userId)).toBe(true);
  });
});
