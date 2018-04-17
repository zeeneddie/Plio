import { compose, flattenProp } from 'recompose';
import { withMutationState } from '../../helpers';
import MilestoneSubcard from '../components/MilestoneSubcard';

export default compose(
  withMutationState(),
  flattenProp('mutation'),
)(MilestoneSubcard);
