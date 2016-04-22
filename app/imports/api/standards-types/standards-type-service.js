import { StandardsTypes } from './standards-types.js';


export default StandardsTypeService = {

  collection: StandardsTypes,

  insert({ name, abbreviation, organizationId }) {
    return this.collection.insert({
      name, abbreviation, organizationId
    });
  },

  update({ _id, name, abbreviation }) {
    return this.collection.update({ _id }, {
      $set: { name, abbreviation }
    });
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  }

};
