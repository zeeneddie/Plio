import { useWith, flip, view, identity } from 'ramda';
import { organizationId } from 'plio-util/dist/lenses';
import { canCompleteActions } from '../../checkers/roles';

export default useWith(flip(canCompleteActions), [
  view(organizationId),
  identity,
]);
