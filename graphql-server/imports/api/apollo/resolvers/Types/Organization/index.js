import { loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';

const {
  userId,
  createdBy,
  updatedBy,
} = lenses;

export default {
  Organization: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
  },
  OrganizationUser: {
    user: loadUserById(view(userId)),
  },
};
