import { equals, compose, ifElse, view, allPass } from 'ramda';
import { lenses, filterBy } from 'plio-util';

import { ActionTypes, ActionStatuses, ActionIndexes } from '../../share/constants';
import { getFormattedDate } from '../../share/helpers';

export const getClassByStatus = (status) => {
  switch (status) {
    case 1:
    case 4:
      return 'yellow';
    case 8:
    case 9:
      return 'success';
    case 2:
    case 5:
      return 'warning';
    case 3:
    case 6:
    case 7:
      return 'danger';
    default:
      return 'default';
  }
};

export const getStatusName = status => ActionStatuses[status];

export const splitActionsByType = (actions) => {
  const map = {
    [ActionTypes.CORRECTIVE_ACTION]: [],
    [ActionTypes.PREVENTATIVE_ACTION]: [],
    [ActionTypes.RISK_CONTROL]: [],
  };

  return actions.reduce((prev, cur) => {
    const key = Object.keys(prev).find(equals(cur.type));

    return key ? ({
      ...prev,
      [key]: [
        ...prev[key],
        cur,
      ],
    }) : ({ ...prev });
  }, map);
};

export const getDisplayDate = compose(
  getFormattedDate,
  ifElse(
    allPass([
      view(lenses.isCompleted),
      view(lenses.completedAt),
    ]),
    view(lenses.completedAt),
    view(lenses.completionTargetDate),
  ),
);

export const getDueActions = filterBy('status', [
  ActionIndexes.DUE_COMPLETION_TODAY,
  ActionIndexes.VERIFY_DUE_TODAY,
]);

export const getOverdueActions = filterBy('status', [
  ActionIndexes.COMPLETION_OVERDUE,
  ActionIndexes.VERIFY_OVERDUE,
  ActionIndexes.COMPLETED_FAILED,
]);
