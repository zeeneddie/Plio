import { compose, mergeDeepLeft } from 'ramda';

import getUsersAsItems from './getUsersAsItems';
import getSortedUsersByFirstName from './getSortedUsersByFirstName';

export default state => compose(
  getUsersAsItems,
  users => mergeDeepLeft({
    collections: { users },
  }, state),
  getSortedUsersByFirstName,
)(state);
