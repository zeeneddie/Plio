import { Standards } from './standards.js';

export default {
  collection: Standards,

  insert({ ...args }) {
    const _id = this.collection.insert(args);
    return this.collection.findOne({ _id: _id });
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
  }
};
