import { compose, view, length } from 'ramda';
import lenses from './lenses';

// ({ standards: Array }) => Number | Any
export const getStandardsLength = compose(length, view(lenses.standards));

export const getRisksLength = compose(length, view(lenses.risks));

export const getUsersLength = compose(length, view(lenses.users));
