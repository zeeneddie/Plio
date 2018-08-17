import { Roles } from 'meteor/alanning:roles';
import moment from 'moment-timezone';

import { UserRoles, ActionUndoTimeInHours } from '../../../../share/constants';
import canActionVerificationBeUndone from '../canActionVerificationBeUndone';

describe('Actions/canActionVerificationBeUndone', () => {
  afterEach(() => Roles.__clear());

  it('returns false if is not verified', () => {
    const userId = 1;
    const action = {
      isVerified: false,
    };

    expect(canActionVerificationBeUndone(action, userId)).toBe(false);
  });

  it('returns false if verifiedAt is not a date', () => {
    const userId = 1;
    const action = {
      isVerified: true,
      verifiedAt: null,
    };

    expect(canActionVerificationBeUndone(action, userId)).toBe(false);
  });

  it('returns false if undo deadline is overdue', () => {
    const userId = 1;
    const action = {
      isVerified: true,
      verifiedAt: moment(new Date()).subtract(ActionUndoTimeInHours).toDate(),
    };

    expect(canActionVerificationBeUndone(action, userId)).toBe(false);
  });

  // eslint-disable-next-line max-len
  it('returns false if verifiedAt does not equal userId and the user does not have any roles', () => {
    const userId = 1;
    const action = {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: 2,
    };

    expect(canActionVerificationBeUndone(action, userId)).toBe(false);
  });

  it('returns true if verifiedBy equals userId', () => {
    const userId = 1;
    const action = {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: userId,
    };

    expect(canActionVerificationBeUndone(action, userId)).toBe(true);
  });

  it('returns true if the user has a role to complete any action', () => {
    const userId = 1;
    const organizationId = 3;
    const action = {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy: 2,
      organizationId,
    };
    Roles.addUsersToRoles(userId, [UserRoles.COMPLETE_ANY_ACTION], organizationId);

    expect(canActionVerificationBeUndone(action, userId)).toBe(true);
  });
});
