import { compose, withState, withHandlers } from 'recompose';

import { not } from '/imports/api/helpers';

export default (initial, prop = 'collapsed', handle = 'onToggleCollapse') => compose(
  withState(prop, 'setCollapsed', initial),
  withHandlers({
    [handle]: props => () => props.setCollapsed(not),
  }),
);
