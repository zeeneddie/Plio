import { useWith, view, identity } from 'ramda';
import { organizationId } from 'plio-util/dist/lenses';
import canCompleteActions from '../roles/canCompleteActions';

export default useWith(canCompleteActions, [
  view(organizationId),
  identity,
]);
