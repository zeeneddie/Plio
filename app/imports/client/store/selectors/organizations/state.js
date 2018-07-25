import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getOrganizationId = view(lenses.organizations.organizationId);

export const getOrganization = view(lenses.organizations.organization);

export const getOrgSerialNumber = view(lenses.organizations.orgSerialNumber);

export const getRiskGuidelines = view(lenses.organizations.organization.rkGuidelines);

export const getNonConformitiesGuidelines = view(lenses.organizations.organization.ncGuidelines);
