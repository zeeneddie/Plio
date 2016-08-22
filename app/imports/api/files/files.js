import { Mongo } from 'meteor/mongo';

import { FilesSchema } from './files-schema.js';


const Files = new Mongo.Collection('Files');
Files.attachSchema(FilesSchema);

export { Files };
