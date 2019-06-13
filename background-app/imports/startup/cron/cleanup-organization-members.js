import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { pluck } from 'ramda';

import { Organizations } from '../../share/collections';

export const job = async () => {
  const opts = { fields: { users: 1 } };
  const promises = await Organizations.find({}, opts).map(async (organization) => {
    const memberIds = pluck('userId', organization.users);
    const users = await Meteor.users.find(
      { _id: { $in: memberIds } },
      { fields: { _id: 1 } },
    ).fetch();
    const userIds = pluck('_id', users);

    if (userIds.length === memberIds.length) return undefined;

    const members = organization.users.filter(({ userId }) => userIds.includes(userId));
    const query = { _id: organization._id };
    const modifier = {
      $set: {
        users: members,
      },
    };

    return Organizations.rawCollection().update(query, modifier);
  });

  return Promise.all(promises);
};

SyncedCron.add({
  name: 'Removes organization members that are no longer Plio users',
  schedule(parser) {
    return parser.text('every 1 minute');
  },
  job,
});
