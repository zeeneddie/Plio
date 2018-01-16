import { Meteor } from 'meteor/meteor';

export default function (root, args, context) {
  // if the user is not logged in throw an error
  if (!context.userId) {
    throw new Meteor.Error(403, 'Unknown User (not logged in)');
  }

  // Only return the current user, for security
  if (context._id === args.id) {
    return context.user;
  }
  return context.user;
}
