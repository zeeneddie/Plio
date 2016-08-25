import { Mongo } from 'meteor/mongo';

import { FilesSchema } from './files-schema.js';


const Files = new Mongo.Collection('Files');
Files.attachSchema(FilesSchema);

Files.helpers({
  isUploaded() {
    console.log('isUploaded progress', this.progress);
    return this.progress === 1;
  }
});

export { Files };
