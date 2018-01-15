import { compose, view } from 'ramda';
import { verifiedAt } from 'plio-util/dist/lenses';

import isUndoDeadlineDue from './isUndoDeadlineDue';

export default compose(isUndoDeadlineDue, view(verifiedAt));
