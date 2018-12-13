import { loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';
import { ANALYSIS_STATUSES } from '../../../../../share/constants';

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
    isCompleted: ({ status }) => status === ANALYSIS_STATUSES.COMPLETED,
  },
};
