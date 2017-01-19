import { Notifications } from '/imports/share/collections/notifications';
import { Discussions } from '/imports/share/collections/discussions';

export default {
  collection: Notifications,

  updateViewedBy({ _id, userId }) {
    const query = { _id };
    const options = {
      $addToSet: {
        viewedBy: userId
      }
    };

    return this.collection.update(query, options);
  },

  insert({ ...args }) {
    return this.collection.insert({ ...args });
  },

  update({ _id, ...args }) {
    const query = { _id };
    const options = {
      '$set': {
        ...args
      }
    };
    return this.collection.update(query, options);
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  },

  unsubscribe({ documentId, documentType, userId }, { collection }) {
    const query = { _id: documentId };
    const modifier = {
      $pull: {
        notify: userId,
      },
    };

    return collection.update(query, modifier);
  },

  unsubscribeFromDiscussion({ documentId: linkedTo, documentType, userId }) {
    const query = { linkedTo, documentType };
    const modifier = {
      $addToSet: {
        mutedBy: userId,
      },
    };

    return Discussions.update(query, modifier);
  },
};
