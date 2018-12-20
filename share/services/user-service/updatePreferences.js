import { mapKeys } from 'plio-util';
import { concat, isNil, reject } from 'ramda';

export default async function updateUserPreferences(args, context) {
  const {
    areNotificationsEnabled,
    areEmailNotificationsEnabled,
    notificationSound,
    defaultCanvasColor,
  } = args;
  const { userId, collections: { Users } } = context;
  const values = {
    areNotificationsEnabled,
    areEmailNotificationsEnabled,
    notificationSound,
    defaultCanvasColor,
  };
  const updater = mapKeys(concat('preferences.'), reject(isNil, values));
  const query = { _id: userId };
  const modifier = {
    $set: {
      ...updater,
      updatedBy: userId,
    },
  };

  return Users.update(query, modifier);
}
