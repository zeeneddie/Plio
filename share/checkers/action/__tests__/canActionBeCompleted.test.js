import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '../../../../share/constants';
import canActionBeCompleted from '../canActionBeCompleted';

describe('Actions/canActionBeCompleted', () => {
  afterEach(() => Roles.__clear());

  it('returns false if is already completed or verified', () => {
    const userId = 1;

    expect(canActionBeCompleted({ isCompleted: true }, userId)).toBe(false);
    expect(canActionBeCompleted({ isVerified: true }, userId)).toBe(false);
  });

  it('returns false if toBeCompletedBy does not equal userId', () => {
    const userId = 1;
    const action = {
      isCompleted: false,
      isVerified: false,
      toBeCompletedBy: 2,
    };

    expect(canActionBeCompleted(action, userId)).toBe(false);
  });

  it('returns false if the user does not have a role to complete any action', () => {
    const userId = 1;
    const action = {
      isCompleted: false,
      isVerified: false,
      toBeCompletedBy: 2,
    };

    expect(canActionBeCompleted(action, userId)).toBe(false);
  });

  it('returns true if toBeCompletedBy equals userId', () => {
    const userId = 1;
    const action = {
      isCompleted: false,
      isVerified: false,
      toBeCompletedBy: userId,
    };

    expect(canActionBeCompleted(action, userId)).toBe(true);
  });

  it('returns true if the user has a role to complete any action', () => {
    const userId = 1;
    const organizationId = 3;
    const action = {
      isCompleted: false,
      isVerified: false,
      toBeCompletedBy: 2,
      organizationId,
    };
    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    expect(canActionBeCompleted(action, userId)).toBe(true);
  });
});
