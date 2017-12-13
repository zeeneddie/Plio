import { view } from 'ramda';

import { lenses } from '../../../../client/util';

export const getIsDiscussionOpened = view(lenses.discussion.isDiscussionOpened);
