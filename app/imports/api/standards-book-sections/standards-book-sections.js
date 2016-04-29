import { Mongo } from 'meteor/mongo';

import { StandardsBookSectionSchema  } from './standards-book-section-schema.js';


const StandardsBookSections = new Mongo.Collection('StandardsBookSections');
StandardsBookSections.attachSchema(StandardsBookSectionSchema);

export { StandardsBookSections };
