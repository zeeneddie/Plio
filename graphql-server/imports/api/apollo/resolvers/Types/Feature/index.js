import { loadOrganizationById, loadUserById, lenses, generateSequentialId } from 'plio-util';
import { view } from 'ramda';

import { Abbreviations, CustomerElementTypes } from '../../../../../share/constants';
import { resolveCustomerElementStatus } from '../util';

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
    documentType: () => CustomerElementTypes.FEATURE,
    status: resolveCustomerElementStatus,
  },
};
