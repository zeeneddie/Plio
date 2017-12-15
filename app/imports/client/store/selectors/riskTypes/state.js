import { view } from 'ramda';

import { lenses } from '../../../util';

export const getRiskTypes = view(lenses.collections.riskTypes);

export const getRiskTypesByIds = view(lenses.collections.riskTypesByIds);
