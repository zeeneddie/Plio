import { Mongo } from 'meteor/mongo';

import { StandardsBookSectionSchema  } from './standards-book-section-schema.js';


const StandardsBookSections = new Mongo.Collection('StandardsBookSections', {
  transform(doc) {
    const title = doc.title;
    const titlePrefix = parseFloat(title);
    if (!isNaN(titlePrefix)) {
      doc.titlePrefix = parseFloat(title);
    } else {
      doc.titlePrefix = title;
    }

    return doc;
  }
});

StandardsBookSections.attachSchema(StandardsBookSectionSchema);
if(Meteor.isClient) window.StandardsBookSections = StandardsBookSections;
export { StandardsBookSections };
