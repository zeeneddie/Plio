import { ascend, view } from 'ramda';
import { lenses } from 'plio-util';

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

/*
interface Profile {
  firstName: String
}

interface Item {
  profile: Profile
}

(Item, Item) => Boolean
*/
export const byProfileFirstName = ascend(view(lenses.profile.firstName));
