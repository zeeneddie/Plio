import { Standards } from './standards.js';


export default {
  collection: Standards,

  insert({ ...args }) {
    // add standard owner to notify list
    args['notify'] = [args.owner];

    return this.collection.insert(args);
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

  updateViewedBy({ _id, userId }) {
    const query = { _id };
    const options = {
      $addToSet: {
        viewedBy: userId
      }
    };
    return this.collection.update({ _id }, options);
  },

  remove({ _id, deletedBy }) {
    const options = {
      $set: {
        isDeleted: true,
        deletedBy,
        deletedAt: new Date()
      }
    };

    return this.collection.update({ _id }, options);
  }
};
