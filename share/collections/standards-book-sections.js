import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { StandardsBookSectionSchema  } from '../schemas/standards-book-section-schema.js';


const StandardsBookSections = new Mongo.Collection(CollectionNames.STANDARD_BOOK_SECTIONS);
StandardsBookSections.attachSchema(StandardsBookSectionSchema);

export { StandardsBookSections };
