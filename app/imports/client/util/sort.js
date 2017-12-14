import { ascend, view } from 'ramda';

import lenses from './lenses';
/*
interface Item {
  sequentialId: ID
}

(Item, Item) => Boolean
*/
export const bySequentialId = ascend(view(lenses.sequentialId));

/*
interface Item {
  deletedAt: Date
}

(Item, Item) => Boolean
*/
export const byDeletedAt = ascend(view(lenses.deletedAt));
