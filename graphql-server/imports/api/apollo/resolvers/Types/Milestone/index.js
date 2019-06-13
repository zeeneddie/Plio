import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  lenses,
} from 'plio-util';
import { view } from 'ramda';
import { getMilestoneStatus } from '../../../../../share/helpers';
import { resolveLinkedGoal } from '../util';

const {
  createdBy,
  updatedBy,
  notify,
  completedBy,
  organizationId,
} = lenses;

export default {
  Milestone: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    organization: loadOrganizationById(view(organizationId)),
    notify: loadUsersById(view(notify)),
    completedBy: loadUserById(view(completedBy)),
    // TODO: subscribe cuz it may change over time
    status: async (milestone, args, { loaders: { Organization: { byId } } }) => {
      const { timezone } = await byId.load(view(organizationId, milestone));
      return getMilestoneStatus(timezone, milestone);
    },
    goal: resolveLinkedGoal,
  },
};
