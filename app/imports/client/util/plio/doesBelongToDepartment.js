import { useWith, contains, view } from 'ramda';
import { viewOr, lenses } from 'plio-util';

// (department: Object) => (item: Object) => Boolean
export default useWith(contains, [
  view(lenses._id),
  viewOr([], lenses.departmentsIds),
]);
