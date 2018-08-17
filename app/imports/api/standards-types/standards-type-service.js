import { StandardTypes } from '/imports/share/collections/standards-types';

export default {
  collection: StandardTypes,
  insert({
    title,
    abbreviation,
    organizationId,
    createdBy,
    isDefault,
  }) {
    return this.collection.insert({
      title,
      abbreviation,
      organizationId,
      createdBy,
      isDefault,
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
