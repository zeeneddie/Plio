import { compose, view, equals } from 'ramda';
import lenses from './lenses';

export const isDeleted = compose(equals(true), view(lenses.isDeleted));
