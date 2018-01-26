import { Roles } from 'meteor/alanning:roles';
import moment from 'moment-timezone';

import { UserRoles, ActionUndoTimeInHours } from '../../../../share/constants';
import canCompletionBeUndone from '../canCompletionBeUndone';

describe('Actions/canCompletionBeUndone', () => {
  afterEach(() => Roles.__clear());

  it('returns false if is not completed', () => {
    const userId = 1;
    const action = {
      isCompleted: false,
    };

    expect(canCompletionBeUndone(action, userId)).toBe(false);
  });

  it('returns false if is verified', () => {
    const userId = 1;
    const action = {
      isCompleted: true,
      isVerified: true,
    };

    expect(canCompletionBeUndone(action, userId)).toBe(false);
  });

  it('returns false if completedAt is not a date', () => {
    const userId = 1;
    const action = {
      isCompleted: true,
      isVerified: false,
      completedAt: null,
    };

    expect(canCompletionBeUndone(action, userId)).toBe(false);
  });

  it('returns false if undo deadline is overdue', () => {
    const userId = 1;
    const action = {
      isCompleted: true,
      isVerified: false,
      completedAt: moment(new Date()).subtract(ActionUndoTimeInHours).toDate(),
    };

    expect(canCompletionBeUndone(action, userId)).toBe(false);
  });

  // eslint-disable-next-line max-len
  it('returns false if completedBy does not equal userId and the user does not have any roles', () => {
    const userId = 1;
    const action = {
      isCompleted: true,
      isVerified: false,
      completedAt: new Date(),
      completedBy: 2,
    };

    expect(canCompletionBeUndone(action, userId)).toBe(false);
  });

  it('returns true if completedBy equals userId', () => {
    const userId = 1;
    const action = {
      isCompleted: true,
      isVerified: false,
      completedAt: new Date(),
      completedBy: userId,
    };

    expect(canCompletionBeUndone(action, userId)).toBe(true);
  });

  it('returns true if the user has a role to complete any action', () => {
    const userId = 1;
    const organizationId = 3;
    const action = {
      isCompleted: true,
      isVerified: false,
      completedAt: new Date(),
      completedBy: 2,
      organizationId,
    };
    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    expect(canCompletionBeUndone(action, userId)).toBe(true);
  });
});
