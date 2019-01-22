import { useWith, view, identity } from 'ramda';
import { lenses } from 'plio-util';
import canCompleteActions from '../roles/canCompleteActions';

const { organizationId } = lenses;

export default useWith(canCompleteActions, [
  view(organizationId),
  identity,
]);
