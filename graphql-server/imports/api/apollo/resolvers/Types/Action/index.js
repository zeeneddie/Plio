import {
  loadUserById,
  loadUsersById,
  loadOrganizationById,
  lenses,
} from 'plio-util';
import { view } from 'ramda';

const {
  createdBy,
  updatedBy,
  completedBy,
  completionAssignedBy,
  verificationAssignedBy,
  deletedBy,
  toBeCompletedBy,
  toBeVerifiedBy,
  verifiedBy,
  notify,
  organizationId,
} = lenses;

export default {
  Action: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    completedBy: loadUserById(view(completedBy)),
    completionAssignedBy: loadUserById(view(completionAssignedBy)),
    verificationAssignedBy: loadUserById(view(verificationAssignedBy)),
    deletedBy: loadUserById(view(deletedBy)),
    toBeCompletedBy: loadUserById(view(toBeCompletedBy)),
    toBeVerifiedBy: loadUserById(view(toBeVerifiedBy)),
    verifiedBy: loadUserById(view(verifiedBy)),
    notify: loadUsersById(view(notify)),
    organization: loadOrganizationById(view(organizationId)),
  },
};
