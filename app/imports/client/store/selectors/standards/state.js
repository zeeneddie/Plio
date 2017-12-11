import { view } from 'ramda';
import lenses from '../lenses';

export const getStandards = view(lenses.collections.standards);

export const getStandardsByIds = view(lenses.collections.standardsByIds);

export const getStandardsFiltered = view(lenses.standards.standardsFiltered);
