import { loadOrganizationById, loadUserById, lenses, generateSequentialId } from 'plio-util';
import { view } from 'ramda';

import { Abbreviations } from '../../../../../share/constants';

const {
  createdBy,
  updatedBy,
  organizationId,
} = lenses;

export default {
  Feature: {
    createdBy: loadUserById(view(createdBy)),
    updatedBy: loadUserById(view(updatedBy)),
    organization: loadOrganizationById(view(organizationId)),
    sequentialId: generateSequentialId(Abbreviations.FEATURE),
  },
};
