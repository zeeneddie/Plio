import { Lessons } from './lessons.js';

export default {
  collection: Lessons,

  insert({ ...args }) {
    return this.collection.insert(args);
  },

  update({ _id, options, ...args }) {
    const query = { _id };
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }
    return this.collection.update(query, options);
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }
};
