import { RiskTypes } from './risk-types.js';


export default {
  collection: RiskTypes,

  insert({ ...args }) {
    return this.collection.insert({ ...args });
  },

  update({ _id, ...args }) {

  },

  remove({ _id }) {

  }
};
