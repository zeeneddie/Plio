import { StandardsBookSections } from './standards-book-sections.js';


export default StandardsBookSectionService = {

  collection: StandardsBookSections,

  insert({ name, number, organizationId }) {
    return this.collection.insert({
      name, number, organizationId
    });
  },

  update({ _id, name, number }) {
    return this.collection.update({ _id }, {
      $set: { name, number }
    });
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }

};
