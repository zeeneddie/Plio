import { view } from 'ramda';

import lenses from '../lenses';

export const getStandardBookSectionsByIds = view(lenses.collections.standardBookSectionsByIds);
