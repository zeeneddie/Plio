import { loadUserById } from 'plio-util';
import { createdBy, updatedBy, completedBy } from 'plio-util/dist/lenses';
import { view } from 'ramda';

export default {
  Action: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    completedBy: loadUserById(view(completedBy)),
  },
};
