import moment from 'moment-timezone';
import { pick, compose, over } from 'ramda';
import {
  getUserOptions,
  lenses,
  mapEntitiesToOptions,
  renameKeys,
} from 'plio-util';
import { ActionPlanOptions, ActionIndexes } from '../../../share/constants';
import { ActionStatusColors } from '../../../api/constants';

export const getGeneralActionValuesByAction = compose(
  pick([
    'title',
    'description',
    'owner',
    'planInPlace',
    'completionTargetDate',
    'toBeCompletedBy',
    'completedAt',
    'completedBy',
    'verifiedAt',
    'verifiedBy',
    'completionComments',
    'verificationComments',
    'toBeVerifiedBy',
    'verificationTargetDate',
    'linkedTo',
    'isCompleted',
  ]),
  renameKeys({ goals: 'linkedTo' }),
  over(lenses.goals, mapEntitiesToOptions),
  over(lenses.toBeVerifiedBy, getUserOptions),
  over(lenses.verifiedBy, getUserOptions),
  over(lenses.completedBy, getUserOptions),
  over(lenses.toBeCompletedBy, getUserOptions),
  over(lenses.owner, getUserOptions),
);

export const getActionFormInitialState = user => ({
  active: 0,
  owner: getUserOptions(user),
  toBeCompletedBy: getUserOptions(user),
  planInPlace: ActionPlanOptions.NO,
  // TODO: Update based on linked documents like creation modal?
  completionTargetDate: moment().add(1, 'days'),
});

export const getActionSymbolColor = (status, color) => {
  switch (status) {
    case ActionIndexes.COMPLETED:
      return color;
    case ActionIndexes.COMPLETION_OVERDUE:
      return ActionStatusColors.OVERDUE;
    default:
      return ActionStatusColors.IN_PROGRESS;
  }
};
