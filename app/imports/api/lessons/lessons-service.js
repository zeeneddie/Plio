import { LessonsLearned } from './lessons.js';

export default {
  collection: LessonsLearned,

  insert({ ...args }) {
    const lastLesson = this.collection.findOne({
      serialNumber: {
        $type: 16 // 32-bit integer
      }
    }, {
      sort: {
        serialNumber: -1
      }
    });

    const serialNumber = lastLesson ? lastLesson.serialNumber + 1 : 1;

    return this.collection.insert({ ...args, serialNumber });
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
  }
};
