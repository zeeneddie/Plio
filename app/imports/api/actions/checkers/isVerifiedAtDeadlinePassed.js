import { compose, view } from 'ramda';
import { verifiedAt } from 'plio-util/dist/lenses';

import isDeadlinePassed from './isDeadlinePassed';

export default compose(isDeadlinePassed, view(verifiedAt));
