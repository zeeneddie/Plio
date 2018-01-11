import {
  is,
  equals,
  propEq,
  allPass,
  compose,
  prop,
  complement,
  flip,
  anyPass,
  useWith,
  identity,
} from 'ramda';
import moment from 'moment-timezone';

import { ActionTypes, ActionUndoTimeInHours } from '../../share/constants';
import { canCompleteActions } from '../checkers/roles';

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

export const isDate = is(Date);
export const isCompleted = propEq('isCompleted', true);
export const isVerified = propEq('isVerified', true);
export const isVerifiedAtDate = compose(isDate, prop('verifiedAt'));
export const isCompletedAtDate = compose(isDate, prop('completedAt'));
export const eqCompletedBy = propEq('completedBy');
export const eqVerifiedBy = propEq('verifiedBy');
export const eqToBeCompletedBy = propEq('toBeCompletedBy');
export const eqToBeVerified = propEq('toBeVerified');
export const isDeadlinePassed = (date) => {
  const undoDeadline = moment(date).add(ActionUndoTimeInHours, 'hours');

  return undoDeadline.isAfter(new Date());
};
export const isCompletedAtDeadlinePassed = compose(isDeadlinePassed, prop('completedAt'));
export const isVerifiedAtDeadlinePassed = compose(isDeadlinePassed, prop('verifiedAt'));
// ({ organizationId: String }: Object, userId: String) => Boolean
export const hasRoleToComplete = useWith(flip(canCompleteActions), [
  prop('organizationId'),
  identity,
]);

// (action: Object, userId: String) => Boolean
export const canBeCompleted = allPass([
  complement(isCompleted),
  complement(isVerified),
  anyPass([
    flip(eqToBeCompletedBy),
    hasRoleToComplete,
  ]),
]);

// (action: Object, userId: String) => Boolean
export const canCompletionBeUndone = allPass([
  isCompleted,
  complement(isVerified),
  isCompletedAtDate,
  flip(eqCompletedBy),
  isCompletedAtDeadlinePassed,
]);

// (action: Object, userId: String) => Boolean
export const canBeVerified = allPass([
  isCompleted,
  complement(isVerified),
  anyPass([
    flip(eqToBeVerified),
    hasRoleToComplete,
  ]),
]);

// (action: Object, userId: String) => Boolean
export const canVerificationBeUndone = allPass([
  isVerified,
  isVerifiedAtDate,
  isVerifiedAtDeadlinePassed,
  flip(eqVerifiedBy),
]);
