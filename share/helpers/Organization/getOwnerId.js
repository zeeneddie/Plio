import { compose, prop, propOr, find } from 'ramda';

import isOwner from './isOwner';

// (organization: Object) => String | any
export default compose(prop('userId'), find(isOwner), propOr([], 'users'));
