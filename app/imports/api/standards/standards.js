import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { StandardsSchema } from './standards-schema.js';
import { CollectionNames } from '../constants.js';
import { getTitlePrefix } from '/imports/api/helpers.js';


const Standards = new Mongo.Collection(CollectionNames.STANDARDS, {
  transform(doc) {
    const title = doc.title;
    if (title) {
      doc.titlePrefix = getTitlePrefix(title);
    }

    return doc;
  }
});

Standards.attachSchema(StandardsSchema);

export { Standards };
