import { StandardTypes } from './standard-types.js';


export default StandardsTypeService = {

  collection: StandardTypes,

  insert({ name, abbreviation, organizationId, createdBy }) {
    return this.collection.insert({
      name, abbreviation, organizationId, createdBy
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
