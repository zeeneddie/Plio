import { LessonsLearned } from '../collections';
import { generateSerialNumber } from '../helpers';

export default {
  collection: LessonsLearned,

  insert({ organizationId, ...args }) {
    const serialNumber = generateSerialNumber(this.collection, { organizationId });

    return this.collection.insert({ ...args, organizationId, serialNumber });
  },

  async update({ _id, ...args }) {
    const query = { _id };
    const options = { $set: args };
    return this.collection.update(query, options);
  },

  async updateViewedBy({ _id, userId }) {
    const query = { _id };
    const options = {
      $addToSet: {
        viewedBy: userId,
      },
    };

    return this.collection.update(query, options);
  },

  async remove({ _id }) {
    return this.collection.remove({ _id });
  },
};
