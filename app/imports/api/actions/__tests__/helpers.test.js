import { values, pluck } from 'ramda';

import { getDueActions, getOverdueActions } from '../helpers';
import { ActionIndexes } from '../../../share/constants';

describe('Actions/helpers', () => {
  const getActions = () => values(ActionIndexes).map(status => ({ status }));

  test('getDueActions', () => {
    const actions = getDueActions(getActions());

    expect(actions).toHaveLength(2);
    expect(pluck('status', actions)).toEqual([
      ActionIndexes.DUE_COMPLETION_TODAY,
      ActionIndexes.VERIFY_DUE_TODAY,
    ]);
  });

  test('getOverdueActions', () => {
    const actions = getOverdueActions(getActions());

    expect(actions).toHaveLength(3);
    expect(pluck('status', actions)).toEqual([
      ActionIndexes.COMPLETION_OVERDUE,
      ActionIndexes.VERIFY_OVERDUE,
      ActionIndexes.COMPLETED_FAILED,
    ]);
  });
});
