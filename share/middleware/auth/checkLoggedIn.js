import { Meteor } from 'meteor/meteor';
import { CollectionHooks } from 'meteor/matb33:collection-hooks';

import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  const { userId } = context;

  if (!userId) {
    throw new Meteor.Error(403, Errors.NOT_LOGGED_IN);
  }

  // workaround for collection hooks not receiving userId in graphql server
  CollectionHooks.defaultUserId = userId;

  return next(root, args, context);
};
