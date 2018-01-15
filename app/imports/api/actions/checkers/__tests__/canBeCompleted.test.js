import canBeCompleted from '../canBeCompleted';

describe('Actions/canBeCompleted', () => {
  it('returns false if is already completed or verified', () => {
    const userId = 1;

    expect(canBeCompleted({ isCompleted: true }, userId)).toBe(false);
    expect(canBeCompleted({ isVerified: true }, userId)).toBe(false);
  });

  it('returns false if toBeCompletedBy does not equal userId', () => {
    const userId = 1;
    const action = {
      isCompleted: false,
      isVerified: false,
      toBeCompletedBy: 2,
    };

    expect(canBeCompleted(action, userId)).toBe(false);
  });

  it('returns false if the user does not have a role to complete any action', () => {
    const userId = 1;
    const action = {
      isCompleted: false,
      isVerified: false,
      toBeCompletedBy: 2,
    };

    console.log(canBeCompleted(action, userId));
  });
});
