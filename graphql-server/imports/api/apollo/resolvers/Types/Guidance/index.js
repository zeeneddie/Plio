import { loadUserById, lenses } from 'plio-util';
import { view } from 'ramda';

const { createdBy, updatedBy } = lenses;

export default {
  Guidance: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
  },
};
