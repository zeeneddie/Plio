import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  loadFilesById,
  lenses,
} from 'plio-util';
import { view, map, flatten } from 'ramda';

import { resolveRisksByIds, resolveLessonsById } from '../util';
import { getGoalStatus } from '../../../../../share/helpers';

const {
  createdBy,
  updatedBy,
  ownerId,
  deletedBy,
  notify,
  organizationId,
  completedBy,
  fileIds,
} = lenses;

export default {
  Goal: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    deletedBy: loadUserById(view(deletedBy)),
    completedBy: loadUserById(view(completedBy)),
    owner: loadUserById(view(ownerId)),
    notify: loadUsersById(view(notify)),
    organization: loadOrganizationById(view(organizationId)),
    files: loadFilesById(view(fileIds)),
    // TODO: subscribe cuz it may change over time
    status: async (goal, args, { loaders: { Organization: { byId } } }) => {
      const { timezone } = await byId.load(view(organizationId, goal));
      return getGoalStatus(timezone, goal);
    },
    lessons: resolveLessonsById,
    actions: async (root, args, context) => {
      const { _id: documentId } = root;
      const { isDeleted = false } = args;
      const { loaders: { Action: { byQuery } } } = context;

      return byQuery.load({ 'linkedTo.documentId': documentId, isDeleted });
    },
    milestones: async (root, args, context) => {
      const { milestoneIds } = root;
      const { loaders: { Milestone: { byQuery } } } = context;

      return byQuery.loadMany(map(milestoneId => ({
        _id: milestoneId,
        isDeleted: false,
      }), milestoneIds)).then(flatten);
    },
    risks: resolveRisksByIds,
  },
};
