import { compose, withContext } from 'recompose';
import PropTypes from 'prop-types';

import withStateCollapsed from './withStateCollapsed';

export default (initial, prop = 'collapsed', handle = 'onToggleCollapse') => compose(
  withStateCollapsed(initial, prop, handle),
  withContext({ [prop]: PropTypes.bool, [handle]: PropTypes.func }, props => ({
    [prop]: props[prop],
    [handle]: props[handle],
  })),
);
