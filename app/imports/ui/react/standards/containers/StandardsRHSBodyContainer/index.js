import { compose, withState, withHandlers } from 'recompose';

import { not } from '/imports/api/helpers';
import StandardsRHSBody from '../../components/StandardsRHSBody';

export default compose(
  withState('collapsed', 'setCollapsed', props => props.collapsed),
  withHandlers({
    onToggleCollapse: props => () => props.setCollapsed(not),
  }),
)(StandardsRHSBody);
