import { Meteor } from 'meteor/meteor';
import Errors from '../../errors';

export default () => async (next, root, args, context) => {
  if (!context.userId) {
    throw new Meteor.Error(403, Errors.NOT_LOGGED_IN);
  }
  return next(root, args, context);
};
