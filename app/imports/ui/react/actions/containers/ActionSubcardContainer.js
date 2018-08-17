import { compose, flattenProp, lifecycle } from 'recompose';
import { withMutationState } from '../../helpers';
import ActionSubcard from '../components/ActionSubcard';

export default compose(
  withMutationState(),
  flattenProp('mutation'),
  lifecycle({
    componentWillReceiveProps({ error }) {
      if (error) this.props.reset();
    },
  }),
)(ActionSubcard);
