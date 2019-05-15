import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { pluck } from 'ramda';

import { Organizations } from '../../share/collections';

export const job = async () => {
  const options = { fields: { users: 1 } };
  const promises = await Organizations.find({}, options).map(async (organization) => {
    const memberIds = pluck('userId', organization.users);
    const users = await Meteor.users.find(
      { _id: { $in: memberIds } },
      { fields: { _id: 1 } },
    ).fetch();
    const userIds = pluck('_id', users);
    const removedUserIds = memberIds.filter(id => !userIds.includes(id));
    const query = { _id: organization._id };
    const modifier = {
      $pull: {
        users: {
          userId: {
            $in: removedUserIds,
          },
        },
      },
    };
    return Organizations.update(query, modifier);
  });

  return Promise.all(promises);
};

SyncedCron.add({
  name: 'Removes organization members that are no longer Plio users',
  schedule(parser) {
    return parser.text('every 1 day');
  },
  job,
});
