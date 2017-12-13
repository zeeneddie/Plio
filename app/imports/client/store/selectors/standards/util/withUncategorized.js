import { set, filter, propEq, append, compose, map } from 'ramda';
import { lenses, getStandardsLength } from '../../../../util';

// (prop: String, standards: Array) => (item: Object) => Object
export const setFilteredStandards = (prop, standards) => item => set(
  lenses.standards,
  filter(propEq(prop, item._id), standards),
  item,
);

// (prop: String, uncategorized: Object, standards: Array, items: Array) => Array
export default (prop, uncategorized, standards, items) => compose(
  filter(getStandardsLength),
  append(uncategorized),
  map(setFilteredStandards(prop, standards)),
)(items);
