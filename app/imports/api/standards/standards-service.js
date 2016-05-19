import { Standards } from './standards.js';
import StandardsNotificationsSender from './standards-notifications-sender.js';


export default {
  collection: Standards,

  insert({ ...args }) {
    const _id = this.collection.insert(args);

    const { createdBy } = args;
    this.addNotifyUser({
      standardId: _id,
      userId: createdBy
    });

    return this.collection.findOne({ _id });
  },

  update({ _id, query = {}, options = {}, ...args }) {
    if (!_.keys(query).length > 0) {
      query = { _id };
    }
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }
    return this.collection.update(query, options);
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  },

  addNotifyUser({ standardId, userId }) {
    const updateResult = this.collection.update({
      _id: standardId
    }, {
      $addToSet: {
        notify: userId
      }
    });

    if (Meteor.isServer) {
      new StandardsNotificationsSender(standardId).addedToNotifyList(userId);
    }

    return updateResult;
  },

  removeNotifyUser({ standardId, userId }) {
    return this.collection.update({
      _id: standardId
    }, {
      $pull: {
        notify: userId
      }
    });
  }
};
