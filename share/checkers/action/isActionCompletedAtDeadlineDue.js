import { compose, view } from 'ramda';
import { completedAt } from 'plio-util/dist/lenses';
import isActionUndoDeadlineDue from './isActionUndoDeadlineDue';

export default compose(isActionUndoDeadlineDue, view(completedAt));
