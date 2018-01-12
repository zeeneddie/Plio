// import {
//   equals,
//   allPass,
//   compose,
//   complement,
//   flip,
//   anyPass,
//   useWith,
//   identity,
//   view,
// } from 'ramda';
import moment from 'moment-timezone';
// import {
  // isCompleted,
  // isVerified,
  // eqToBeCompletedBy,
  // eqToBeVerifiedBy,
  // eqCompletedBy,
  // eqVerifiedBy,
  // isCompletedAtDate,
  // isVerifiedAtDate,
// } from 'plio-util';
// import { completedAt, verifiedAt, organizationId } from 'plio-util/dist/lenses';

// import { ActionTypes, ActionUndoTimeInHours } from '../../share/constants';
// import { canCompleteActions } from '../checkers/roles';

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

// export const splitActionsByType = (actions) => {
//   const map = {
//     [ActionTypes.CORRECTIVE_ACTION]: [],
//     [ActionTypes.PREVENTATIVE_ACTION]: [],
//     [ActionTypes.RISK_CONTROL]: [],
//   };

//   return actions.reduce((prev, cur) => {
//     const key = Object.keys(prev).find(equals(cur.type));

//     return key ? ({
//       ...prev,
//       [key]: [
//         ...prev[key],
//         cur,
//       ],
//     }) : ({ ...prev });
//   }, map);
// };

// export const isDeadlinePassed = (date) => {
//   const undoDeadline = moment(date).add(ActionUndoTimeInHours, 'hours');

//   return undoDeadline.isAfter(new Date());
// };
// export const isCompletedAtDeadlinePassed = compose(isDeadlinePassed, view(completedAt));
// export const isVerifiedAtDeadlinePassed = compose(isDeadlinePassed, view(verifiedAt));
// // ({ organizationId: String }: Object, userId: String) => Boolean
// export const hasRoleToComplete = useWith(flip(canCompleteActions), [
//   view(organizationId),
//   identity,
// ]);

// // (action: Object, userId: String) => Boolean
// export const canBeCompleted = allPass([
//   complement(isCompleted),
//   complement(isVerified),
//   anyPass([
//     flip(eqToBeCompletedBy),
//     hasRoleToComplete,
//   ]),
// ]);

// // (action: Object, userId: String) => Boolean
// export const canCompletionBeUndone = allPass([
//   isCompleted,
//   complement(isVerified),
//   isCompletedAtDate,
//   flip(eqCompletedBy),
//   isCompletedAtDeadlinePassed,
// ]);

// // (action: Object, userId: String) => Boolean
// export const canBeVerified = allPass([
//   isCompleted,
//   complement(isVerified),
//   anyPass([
//     flip(eqToBeVerifiedBy),
//     hasRoleToComplete,
//   ]),
// ]);

// // (action: Object, userId: String) => Boolean
// export const canVerificationBeUndone = allPass([
//   isVerified,
//   isVerifiedAtDate,
//   isVerifiedAtDeadlinePassed,
//   flip(eqVerifiedBy),
// ]);
