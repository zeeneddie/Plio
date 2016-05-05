import { Standards } from './standards.js';

export default {
  collection: Standards,

  insert({ ...args }) {
    return this.collection.insert(args);
  },

  update({ _id, options, ...args }) {
    const query = { _id }
    console.log(options);
    // if (!_.keys(options).length > 0) {
    //   options['$set'] = args;
    // }
    // return this.collection.update(query, options);
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }
};
