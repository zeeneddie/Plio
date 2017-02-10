import { Mongo } from 'meteor/mongo';

import { HelpSectionSchema } from '../schemas/help-section-schema.js';
import { CollectionNames } from '../constants';


const HelpSections = new Mongo.Collection(CollectionNames.HELP_SECTIONS);

HelpSections.attachSchema(HelpSectionSchema);

HelpSections.publicFields = {
  index: 1,
  title: 1,
};

export { HelpSections };
