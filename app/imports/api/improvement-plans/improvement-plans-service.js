import { ImprovementPlans } from './improvement-plans.js';

export default {
  collection: ImprovementPlans,

  insert({ ...args }) {
    this.collection.insert({ ...args });
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
};
