import { compose, view } from 'ramda';
import { lenses } from 'plio-util';
import isActionUndoDeadlineDue from './isActionUndoDeadlineDue';

const { completedAt } = lenses;

export default compose(isActionUndoDeadlineDue, view(completedAt));
