import { view } from 'ramda';
import lenses from '../lenses';

export const getOrganizationId = view(lenses.organizations.organizationId);

export const getOrganization = view(lenses.organizations.organization);

export const getOrgSerialNumber = view(lenses.organizations.orgSerialNumber);
