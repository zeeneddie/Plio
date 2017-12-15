import { useWith, contains, view } from 'ramda';
import lenses, { viewOr } from '../lenses';

// (department: Object) => (item: Object) => Boolean
export default useWith(contains, [
  view(lenses._id),
  viewOr([], lenses.departmentsIds),
]);
