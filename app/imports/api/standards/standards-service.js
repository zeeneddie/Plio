import { Standards } from './standards.js';

export default {
  collection: Standards,

  insert({ ...args }) {
    return this.collection.insert(args);
  },

  update({ _id, ...args }) {
    const query = { _id }
    const options = {};
    options['$set'] = args;
    this.collection.update(query, options);
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }
};
