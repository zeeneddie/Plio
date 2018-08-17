import { loadOrganizationById, loadUserById, lenses, generateSequentialId } from 'plio-util';
import { view } from 'ramda';

import { Abbreviations } from '../../../../../share/constants';

const {
  createdBy,
  updatedBy,
  owner,
  organizationId,
} = lenses;

export default {
  Lesson: {
    sequentialId: generateSequentialId(Abbreviations.LESSON),
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    owner: loadUserById(view(owner)),
    organization: loadOrganizationById(view(organizationId)),
  },
};
