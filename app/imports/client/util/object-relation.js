import { compose, view, equals, curry } from 'ramda';
import lenses from './lenses';

// ({ isDeleted: Boolean }) => Boolean
export const isDeleted = compose(equals(true), view(lenses.isDeleted));

// (lens: Lens, val: Any, obj: Object) => Boolean
export const lensEq = curry((lens, val, obj) => compose(equals(val), view(lens))(obj));

// (lens: Lens, val: Object) => (obj: Object) => Boolean
export const lensEqById = curry((lens, val) => compose(lensEq(lens), view(lenses._id))(val));
