import { useWith, contains, view } from 'ramda';
import lenses from '../lenses';

// (department: Object) => (item: Object) => Boolean
export default useWith(contains, [
  view(lenses._id),
  view(lenses.departmentsIds),
]);
