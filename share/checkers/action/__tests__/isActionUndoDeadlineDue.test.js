import moment from 'moment-timezone';
import isActionUndoDeadlineDue from '../isActionUndoDeadlineDue';
import { ActionUndoTimeInHours } from '../../../../share/constants';

describe('Actions/isActionUndoDeadlineDue', () => {
  it('returns true if undo deadline is not overdue', () => {
    expect(isActionUndoDeadlineDue(new Date())).toBe(true);
  });

  it('returns false if undo deadline is overdue', () => {
    const deadline = moment(new Date()).subtract(ActionUndoTimeInHours, 'hours');

    expect(isActionUndoDeadlineDue(deadline)).toBe(false);
  });
});
