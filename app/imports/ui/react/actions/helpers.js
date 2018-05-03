import moment from 'moment-timezone';
import { pick, compose, over } from 'ramda';
import {
  getUserOptions,
  lenses,
  mapEntitiesToOptions,
  renameKeys,
} from 'plio-util';
import { ActionPlanOptions } from '../../../share/constants';

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
  completionTargetDate: moment(),
});
