import { compose, view } from 'ramda';
import { verifiedAt } from 'plio-util/dist/lenses';

import isActionUndoDeadlineDue from './isActionUndoDeadlineDue';

export default compose(isActionUndoDeadlineDue, view(verifiedAt));
