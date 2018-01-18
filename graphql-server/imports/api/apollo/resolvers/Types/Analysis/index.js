import { loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';

const {
  executor,
  completedBy,
  assignedBy,
} = lenses;

export default {
  Analysis: {
    executor: loadUserById(view(executor)),
    completedBy: loadUserById(view(completedBy)),
    assignedBy: loadUserById(view(assignedBy)),
  },
};
