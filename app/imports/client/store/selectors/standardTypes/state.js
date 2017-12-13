import { view } from 'ramda';

import { lenses } from '../../../../client/util';

export const getStandardTypesByIds = view(lenses.collections.standardTypesByIds);

export const getStandardTypes = view(lenses.collections.standardTypes);
