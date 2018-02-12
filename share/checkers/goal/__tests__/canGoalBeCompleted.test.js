import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '../../../../share/constants';
import canGoalBeCompleted from '../canGoalBeCompleted';

describe('canGoalBeCompleted', () => {
  afterEach(() => Roles.__clear());

  it('returns false if is already completed', () => {
    const userId = 1;

    expect(canGoalBeCompleted({ isCompleted: true }, userId)).toBe(false);
  });

  it('returns false if the user does not have a role to complete any action', () => {
    const userId = 1;
    const action = {
      isCompleted: false,
    };

    expect(canGoalBeCompleted(action, userId)).toBe(false);
  });

  it('returns true if the user has a role to complete any action', () => {
    const userId = 1;
    const organizationId = 2;
    const action = {
      isCompleted: false,
      organizationId,
    };

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    expect(canGoalBeCompleted(action, userId)).toBe(true);
  });
});
