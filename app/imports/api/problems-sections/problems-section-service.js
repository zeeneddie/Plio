import { ProblemsSections } from './problems-sections.js';


export default {
  collection: ProblemsSections,

  insert({ ...args }) {
    return this.collection.insert({ ...args });
  },

  update() {

  },

  remove({}) {

  }
};
