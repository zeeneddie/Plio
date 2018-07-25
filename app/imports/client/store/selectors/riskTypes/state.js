import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getRiskTypes = view(lenses.collections.riskTypes);

export const getRiskTypesByIds = view(lenses.collections.riskTypesByIds);
