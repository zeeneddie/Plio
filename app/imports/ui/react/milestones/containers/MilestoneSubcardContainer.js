import { compose, flattenProp, lifecycle } from 'recompose';
import { withMutationState } from '../../helpers';
import MilestoneSubcard from '../components/MilestoneSubcard';

export default compose(
  withMutationState(),
  flattenProp('mutation'),
  lifecycle({
    componentWillReceiveProps({ error }) {
      if (error) this.props.reset();
    },
  }),
)(MilestoneSubcard);
