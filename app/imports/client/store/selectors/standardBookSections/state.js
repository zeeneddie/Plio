import { view } from 'ramda';

import { lenses } from '../../../../client/util';

export const getStandardBookSectionsByIds = view(lenses.collections.standardBookSectionsByIds);

export const getStandardBookSections = view(lenses.collections.standardBookSections);
