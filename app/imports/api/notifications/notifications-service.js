import { Notifications } from '/imports/share/collections/notifications';

export default {
  collection: Notifications,

  updateViewedBy({ _id, userId }) {
    const query = { _id };
    const options = {
      $addToSet: {
        viewedBy: userId,
      },
    };

    return this.collection.update(query, options);
  },

  update({ _id, ...args }) {
    const query = { _id };
    const options = {
      $set: {
        ...args,
      },
    };
    return this.collection.update(query, options);
  },

  unsubscribe({ documentId, userId }, { collection }) {
    const query = { _id: documentId };
    const modifier = {
      $pull: {
        notify: userId,
      },
    };

    return collection.update(query, modifier);
  },
};
