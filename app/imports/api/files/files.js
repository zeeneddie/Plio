import { Mongo } from 'meteor/mongo';

import { FileIdsSchema } from './files-schema.js';


const Files = new Mongo.Collection('Files');
Files.attachSchema(FileIdsSchema);

Files.helpers({
  isUploaded() {
    console.log('isUploaded progress', this.progress);
    return this.progress === 1;
  }
});

export { Files };
