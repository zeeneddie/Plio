import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getIsDiscussionOpened = view(lenses.discussion.isDiscussionOpened);
