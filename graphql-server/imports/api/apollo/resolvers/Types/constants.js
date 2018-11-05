import { view } from 'ramda';
import {
  loadOrganizationById,
  loadUserById,
  loadUsersById,
  lenses,
} from 'plio-util';
import {
  resolveGoalsByIds,
  resolveStandardsByIds,
  resolveRisksByIds,
  resolveLessonsById,
  resolveNonconformitiesByIds,
  resolvePotentialGainsByIds,
} from './util';

const {
  createdBy,
  updatedBy,
  originatorId,
  organizationId,
  notify,
} = lenses;

export const CanvasResolvers = {
  createdBy: loadUserById(view(createdBy)),
  updatedBy: loadUserById(view(updatedBy)),
  originator: loadUserById(view(originatorId)),
  organization: loadOrganizationById(view(organizationId)),
  notify: loadUsersById(view(notify)),
  goals: resolveGoalsByIds,
  standards: resolveStandardsByIds,
  risks: resolveRisksByIds,
  lessons: resolveLessonsById,
  nonconformities: resolveNonconformitiesByIds,
  potentialGains: resolvePotentialGainsByIds,
};
