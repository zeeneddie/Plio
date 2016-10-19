import { Mongo } from 'meteor/mongo';

import { StandardsBookSectionSchema } from '../schemas/standards-book-section-schema.js';
import { CollectionNames } from '../constants.js';
import { getTitlePrefix } from '../helpers.js';


const StandardsBookSections = new Mongo.Collection(CollectionNames.STANDARD_BOOK_SECTIONS, {
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
