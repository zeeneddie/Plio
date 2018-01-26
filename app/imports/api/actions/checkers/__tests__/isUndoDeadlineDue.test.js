import moment from 'moment-timezone';
import isUndoDeadlineDue from '../isUndoDeadlineDue';
import { ActionUndoTimeInHours } from '../../../../share/constants';

describe('Actions/isUndoDeadlineDue', () => {
  it('returns true if undo deadline is not overdue', () => {
    expect(isUndoDeadlineDue(new Date())).toBe(true);
  });

  it('returns false if undo deadline is overdue', () => {
    const deadline = moment(new Date()).subtract(ActionUndoTimeInHours, 'hours');

    expect(isUndoDeadlineDue(deadline)).toBe(false);
  });
});
