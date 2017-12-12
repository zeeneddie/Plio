import { view } from 'ramda';

import lenses from '../lenses';

export const getStandardTypesByIds = view(lenses.collections.standardTypesByIds);
