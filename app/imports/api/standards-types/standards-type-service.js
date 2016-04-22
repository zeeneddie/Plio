import { StandardsTypes } from './standards-types.js';


export default StandardsTypeService = {

  insert({ name, abbreviation, organizationId }) {
    return StandardsTypes.insert({
      name, abbreviation, organizationId
    });
  },

  update({ _id, name, abbreviation }) {
    return StandardsTypes.update({ _id }, {
      $set: { name, abbreviation }
    });
  },

  remove({ _id }) {
    return StandardsTypes.remove({ _id });
  }

};
