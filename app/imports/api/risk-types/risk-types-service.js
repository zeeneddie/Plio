import { RiskTypes } from '/imports/share/collections/risk-types.js';


export default {
  collection: RiskTypes,

  insert({ title, abbreviation, organizationId }) {
    return this.collection.insert({ title, abbreviation, organizationId });
  },

  update({ _id, title, abbreviation }) {
    return this.collection.update({ _id }, { $set: { title, abbreviation } });
  },

  remove({ _id }) {
    return this.collection.remove({ _id });
  },
};
