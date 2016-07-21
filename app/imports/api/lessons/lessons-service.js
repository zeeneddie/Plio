import { LessonsLearned } from './lessons.js';

export default {
  collection: LessonsLearned,

  insert({ organizationId, ...args }) {
    const lastLesson = this.collection.findOne({
      organizationId,
      serialNumber: {
        $type: 16 // 32-bit integer
      }
    }, {
      sort: {
        serialNumber: -1
      }
    });

    const serialNumber = lastLesson ? lastLesson.serialNumber + 1 : 1;

    return this.collection.insert({ ...args, organizationId, serialNumber });
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

  updateViewedBy({ _id, userId }) {
    const query = { _id };
    const options = {
      $addToSet: {
        viewedBy: userId
      }
    };

    return this.collection.update(query, options);
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }
};
