import { Meteor } from 'meteor/meteor';


export const checkUserId = (userId, errMessage) => {
  if (!userId) {
    throw new Meteor.Error(403, errMessage);
  }
};
