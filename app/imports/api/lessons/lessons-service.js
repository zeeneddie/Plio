import { LessonsLearned } from './lessons.js';

export default {
  collection: LessonsLearned,

  insert({ ...args }) {
    return this.collection.insert(args);
  },

  update({ _id, ...args }) {
    const query = { _id };
    const options = {
      '$set': {
        ...args
      }
    };
    console.log(options);
    return this.collection.update(query, options);
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }
};
