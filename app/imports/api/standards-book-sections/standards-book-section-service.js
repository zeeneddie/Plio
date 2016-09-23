import { StandardsBookSections } from '/imports/share/collections/standards-book-sections.js';


export default StandardsBookSectionService = {

  collection: StandardsBookSections,

  insert({ title, organizationId }) {
    return this.collection.insert({
      title, organizationId
    });
  },

  update({ _id, title }) {
    return this.collection.update({ _id }, {
      $set: { title }
    });
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }

};
