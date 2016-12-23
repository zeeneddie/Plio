import { compose, withState, withHandlers } from 'recompose';

import { not } from '/imports/api/helpers';

export default (initial) => compose(
  withState('collapsed', 'setCollapsed', initial),
  withHandlers({
    onToggleCollapse: props => () => props.setCollapsed(not),
  }),
);
