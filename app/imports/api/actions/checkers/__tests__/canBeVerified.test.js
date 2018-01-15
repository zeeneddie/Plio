import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '../../../../share/constants';
import canBeVerified from '../canBeVerified';

describe('Actions/canBeVerified', () => {
  afterEach(() => Roles.__clear());

  it('returns false if is not completed', () => {
    const userId = 1;
    const action = { isCompleted: false };

    expect(canBeVerified(action, userId)).toBe(false);
  });

  it('returns false if is verified', () => {
    const userId = 1;
    const action = {
      isCompleted: true,
      isVerified: true,
    };

    expect(canBeVerified(action, userId)).toBe(false);
  });

  it('returns false if toBeVerifiedBy does not equal userId', () => {
    const userId = 1;
    const action = {
      isCompleted: true,
      isVerified: false,
      toBeVerifiedBy: 2,
    };

    expect(canBeVerified(action, userId)).toBe(false);
  });

  it('returns false if the user does not have a role to complete any action', () => {
    const userId = 1;
    const action = {
      isCompleted: true,
      isVerified: false,
      toBeVerifiedBy: 2,
    };

    expect(canBeVerified(action, userId)).toBe(false);
  });

  it('returns true if toBeVerifiedBy equals userId', () => {
    const userId = 1;
    const action = {
      isCompleted: true,
      isVerified: false,
      toBeVerifiedBy: userId,
    };

    expect(canBeVerified(action, userId)).toBe(true);
  });

  it('returns true if the user has a role to complete any action', () => {
    const userId = 1;
    const organizationId = 3;
    const action = {
      isCompleted: true,
      isVerified: false,
      toBeVerifiedBy: 2,
      organizationId,
    };
    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    expect(canBeVerified(action, userId)).toBe(true);
  });
});
