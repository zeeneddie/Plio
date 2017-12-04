import { StandardTypes } from '/imports/share/collections/standards-types.js';


export default StandardsTypeService = {

  collection: StandardTypes,

  insert({
    title, abbreviation, organizationId, createdBy,
  }) {
    return this.collection.insert({
      title, abbreviation, organizationId, createdBy,
    });
  },

  update({ _id, title, abbreviation }) {
    return this.collection.update({ _id }, {
      $set: { title, abbreviation },
    });
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  },

};
