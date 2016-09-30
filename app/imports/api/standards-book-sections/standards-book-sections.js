import { Mongo } from 'meteor/mongo';

import { StandardsBookSectionSchema  } from './standards-book-section-schema.js';
import { getTitlePrefix } from '/imports/api/helpers.js';

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

export { StandardsBookSections };
