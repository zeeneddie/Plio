import { view } from 'ramda';

import lenses from '../lenses';

export const getIsDiscussionOpened = view(lenses.discussion.isDiscussionOpened);
