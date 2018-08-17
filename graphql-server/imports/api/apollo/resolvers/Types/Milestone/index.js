import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  lenses,
  loadGoalsById,
} from 'plio-util';
import { view, compose, map } from 'ramda';
import { getMilestoneStatus } from '../../../../../share/helpers';

const {
  createdBy,
  updatedBy,
  notify,
  completedBy,
  organizationId,
  linkedTo,
  documentId,
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
    goals: loadGoalsById(compose(
      map(view(documentId)),
      view(linkedTo),
    )),
  },
};
