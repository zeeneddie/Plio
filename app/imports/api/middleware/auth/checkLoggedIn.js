import { Meteor } from 'meteor/meteor';
import { UNAUTHORIZED } from '../../errors';

export default () => (next, args, context) => {
  if (!context.userId) {
    throw new Meteor.Error(403, UNAUTHORIZED.reason);
  }
  return next(args, context);
};
