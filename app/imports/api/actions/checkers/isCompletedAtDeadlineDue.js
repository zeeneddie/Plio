import { compose, view } from 'ramda';
import { completedAt } from 'plio-util/dist/lenses';
import isUndoDeadlineDue from './isUndoDeadlineDue';

export default compose(isUndoDeadlineDue, view(completedAt));
