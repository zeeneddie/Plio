import { ImprovementPlans } from './improvement-plans.js';

export default {
  collection: ImprovementPlans,

  insert({ ...args }) {
    this.collection.insert({ ...args });
  },

  update({ _id, ...args }) {
    const query = { _id };
    const options = { $set: { ...args } };

    this.collection.update(query, options);
  }
};
