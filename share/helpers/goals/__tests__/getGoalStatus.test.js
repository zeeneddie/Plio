import moment from 'moment-timezone';
import getGoalStatus from '../getGoalStatus';
import { GoalStatuses } from '../../../constants';

describe('getGoalStatus', () => {
  const tz = moment.tz.guess();
  it('returns correct status if goal is completed', () => {
    const goal = {
      isCompleted: true,
    };

    expect(getGoalStatus(tz, goal)).toBe(GoalStatuses.COMPLETED);
  });

  it('returns correct status if goal is overdue', () => {
    const goal = {
      isCompleted: false,
      endDate: moment().subtract(2, 'days').toDate(),
    };

    expect(getGoalStatus(tz, goal)).toBe(GoalStatuses.OVERDUE);
  });

  it('prioritizes completed status over overdue', () => {
    const goal = {
      isCompleted: true,
      endDate: moment().subtract(2, 'days').toDate(),
    };

    expect(getGoalStatus(tz, goal)).toBe(GoalStatuses.COMPLETED);
  });

  it('returns "awaiting completion" status otherwise', () => {
    const goal = {
      isCompleted: false,
      endDate: moment().add(2, 'days').toDate(),
    };

    expect(getGoalStatus(tz, goal)).toBe(GoalStatuses.AWAITING_COMPLETION);
  });
});
