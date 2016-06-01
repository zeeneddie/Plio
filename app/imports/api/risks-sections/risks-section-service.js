import { RisksSections } from './risks-sections.js';


export default {
  collection: RisksSections,

  insert({ ...args }) {
    return this.collection.insert(args);
  },

  update() {

  },

  remove({}) {

  }
};
