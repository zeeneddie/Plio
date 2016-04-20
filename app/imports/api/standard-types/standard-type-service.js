import { StandardTypes } from './standard-types.js';


export default StandardTypeService = {

  insert({ name, abbreviation, organizationId }) {
    return StandardTypes.insert({
      name, abbreviation, organizationId
    });
  },

  update({ _id, name, abbreviation }) {
    return StandardTypes.update({ _id }, {
      $set: { name, abbreviation }
    });
  },

  remove({ _id }) {
    return StandardTypes.remove({ _id });
  }

};
