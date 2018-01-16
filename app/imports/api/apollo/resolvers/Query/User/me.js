import { Meteor } from 'meteor/meteor';

export default function (root, args, { userId, user }) {
  // if the user is not logged in throw an error
  if (!userId) {
    throw new Meteor.Error(403, 'Unknown User (not logged in)');
  }

  return user;
}
