import { Roles } from 'meteor/alanning:roles';

import { UserRoles } from '../../../../share/constants';
import canCompleteAny from '../canCompleteAny';

describe('Actions/canCompleteAny', () => {
  afterEach(() => Roles.__clear());

  it('returns false if the user does not have a role to complete any action', () => {
    expect(canCompleteAny({ organizationId: 2 }, 1)).toBe(false);
  });

  it('returns true if the user has a role to complete any action', () => {
    const userId = 1;
    const organizationId = 2;

    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ACTIONS], organizationId);

    expect(canCompleteAny({ organizationId }, userId)).toBe(true);
  });
});
