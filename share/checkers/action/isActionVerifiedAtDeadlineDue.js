import { compose, view } from 'ramda';
import { lenses } from 'plio-util';

import isActionUndoDeadlineDue from './isActionUndoDeadlineDue';

const { verifiedAt } = lenses;

export default compose(isActionUndoDeadlineDue, view(verifiedAt));
