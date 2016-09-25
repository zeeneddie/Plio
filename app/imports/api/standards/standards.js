import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { StandardsSchema } from './standards-schema.js';
import { CollectionNames } from '../constants.js';


const Standards = new Mongo.Collection(CollectionNames.STANDARDS, {
  transform(doc) {
    const title = doc.title;
    const titlePrefix = parseFloat(title);
    if (!isNaN(titlePrefix)) {
      doc.titlePrefix = titlePrefix;
    } else {

      // Sorting hack. We need to display standards with no numeric prefixes after at the end of the list
      doc.titlePrefix = title;
    }

    return doc;
  }
});
Standards.attachSchema(StandardsSchema);
if (Meteor.isClient) {
  window.Standards = Standards;
}

export { Standards };
