import { compose, flattenProp } from 'recompose';
import { withMutationState } from '../../helpers';
import ActionSubcard from '../components/ActionSubcard';

export default compose(
  withMutationState(),
  flattenProp('mutation'),
)(ActionSubcard);
