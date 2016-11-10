import { compose, withHandlers, withState } from 'recompose';

import Collapse from '../../components/Collapse';
import { not } from '/imports/api/helpers';

export default compose(
  withState('collapsed', 'setCollapsed', ({ collapsed = true }) => collapsed),
  withHandlers({
    onToggleCollapse: props => () => props.setCollapsed(not),
  }),
)(Collapse);
