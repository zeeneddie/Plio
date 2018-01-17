import { loadUserById, loadUsersById } from 'plio-util';
import {
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
} from 'plio-util/dist/lenses';
import { view } from 'ramda';

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
  },
};
