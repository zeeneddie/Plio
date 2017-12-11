import { view } from 'ramda';
import lenses from '../lenses';

export const getOrganizationId = view(lenses.organizations.organizationId);
