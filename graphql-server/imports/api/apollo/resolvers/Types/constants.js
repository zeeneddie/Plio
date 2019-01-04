import { view } from 'ramda';
import {
  loadOrganizationById,
  loadUserById,
  loadUsersById,
  lenses,
} from 'plio-util';
import {
  resolveLinkedGoals,
  resolveLinkedStandards,
  resolveLinkedRisks,
  resolveLessonsById,
  resolveLinkedNonconformities,
  resolveLinkedPotentialGains,
  resolveLinkedFiles,
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
  goals: resolveLinkedGoals,
  standards: resolveLinkedStandards,
  risks: resolveLinkedRisks,
  lessons: resolveLessonsById,
  nonconformities: resolveLinkedNonconformities,
  potentialGains: resolveLinkedPotentialGains,
  files: resolveLinkedFiles,
};
