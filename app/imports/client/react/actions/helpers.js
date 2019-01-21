import { pick, compose, over } from 'ramda';
import {
  getUserOptions,
  lenses,
  mapEntitiesToOptions,
  renameKeys,
} from 'plio-util';
import { ActionIndexes } from '../../../share/constants';
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
    'isVerified',
    'isVerifiedAsEffective',
    'workflowType',
  ]),
  renameKeys({ goals: 'linkedTo' }),
  over(lenses.goals, mapEntitiesToOptions),
  over(lenses.toBeVerifiedBy, getUserOptions),
  over(lenses.verifiedBy, getUserOptions),
  over(lenses.completedBy, getUserOptions),
  over(lenses.toBeCompletedBy, getUserOptions),
  over(lenses.owner, getUserOptions),
);

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
