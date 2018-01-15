import { compose, view } from 'ramda';
import { completedAt } from 'plio-util/dist/lenses';
import isDeadlinePassed from './isDeadlinePassed';

export default compose(isDeadlinePassed, view(completedAt));
