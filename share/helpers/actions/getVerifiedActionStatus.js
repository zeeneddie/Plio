import { ifElse, always } from 'ramda';
import { isVerifiedAsEffective } from 'plio-util';

import { ActionIndexes } from '../../constants';

export default ifElse(
  isVerifiedAsEffective,
  always(ActionIndexes.COMPLETED_EFFECTIVE),
  always(ActionIndexes.COMPLETED_FAILED),
);
