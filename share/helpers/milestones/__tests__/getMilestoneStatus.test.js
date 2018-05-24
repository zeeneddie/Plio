import moment from 'moment-timezone';
import getMilestoneStatus from '../getMilestoneStatus';
import { MilestoneStatuses } from '../../../constants';

describe('getMilestoneStatus', () => {
  const tz = moment.tz.guess();
  it('returns correct status if milestone is completed', () => {
    const milestone = {
      isCompleted: true,
    };

    expect(getMilestoneStatus(tz, milestone)).toBe(MilestoneStatuses.COMPLETED);
  });

  it('returns correct status if milestone is due today', () => {
    const milestone = {
      isCompleted: false,
      completionTargetDate: new Date(),
    };

    expect(getMilestoneStatus(tz, milestone)).toBe(MilestoneStatuses.DUE_TODAY);
  });

  it('returns correct status if milestone is overdue', () => {
    const milestone = {
      isCompleted: false,
      completionTargetDate: moment().subtract(2, 'days').toDate(),
    };

    expect(getMilestoneStatus(tz, milestone)).toBe(MilestoneStatuses.OVERDUE);
  });

  it('prioritizes completed status over overdue', () => {
    const milestone = {
      isCompleted: true,
      completionTargetDate: moment().subtract(2, 'days').toDate(),
    };

    expect(getMilestoneStatus(tz, milestone)).toBe(MilestoneStatuses.COMPLETED);
  });

  it('returns "awaiting completion" status otherwise', () => {
    const milestone = {
      isCompleted: false,
      completionTargetDate: moment().add(2, 'days').toDate(),
    };

    expect(getMilestoneStatus(tz, milestone)).toBe(MilestoneStatuses.AWAITING_COMPLETION);
  });
});
