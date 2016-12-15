import { Mongo } from 'meteor/mongo';

import { HelpDocSchema } from '../schemas/help-doc-schema.js';
import { CollectionNames } from '../constants';


const HelpDocs = new Mongo.Collection(CollectionNames.HELP_DOCS);

HelpDocs.attachSchema(HelpDocSchema);

export { HelpDocs };
