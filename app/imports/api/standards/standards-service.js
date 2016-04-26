import { Standards } from './standards.js';

export default {
  collection: Standards,

  insert({ title, type, sectionId, nestingLevel, number, description, approved, approvedAt, notes, owner, issueNumber, status, departments }) {

    return this.collection.insert({ title, type, sectionId, nestingLevel, number, description, approved, approvedAt, notes, owner, issueNumber, status, departments });
    
  },

  update({}) {

  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }
};
