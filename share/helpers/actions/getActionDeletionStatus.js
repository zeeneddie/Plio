import { isDeleted, noop } from 'plio-util';
import { always, ifElse } from 'ramda';

import { ActionIndexes } from '../../constants';

export default ifElse(
  isDeleted,
  always(ActionIndexes.DELETED),
  noop,
);
