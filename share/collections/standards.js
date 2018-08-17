import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { StandardsSchema } from '../schemas/standards-schema.js';
import { CollectionNames } from '../constants.js';

const Standards = new Mongo.Collection(CollectionNames.STANDARDS, {
  transform(doc) {
    const title = doc.title;
    if (title) {
      doc.titlePrefix = title;
    }

    return doc;
  },
});

Standards.attachSchema(StandardsSchema);

Standards.publicFields = {
  organizationId: 1,
  title: 1,
  typeId: 1,
  sectionId: 1,
  nestingLevel: 1,
  viewedBy: 1,
  createdAt: 1,
  owner: 1,
  uniqueNumber: 1,
  isDeleted: 1,
  deletedAt: 1,
  deletedBy: 1,
};

export { Standards };
