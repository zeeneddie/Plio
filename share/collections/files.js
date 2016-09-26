import { Mongo } from 'meteor/mongo';

import { FileIdsSchema } from '../schemas/files-schema.js';


const Files = new Mongo.Collection('Files');
Files.attachSchema(FileIdsSchema);

Files.helpers({
  isUploaded() {
    return this.progress === 1;
  },
  isFailed() {
    return this.status === 'failed' || this.status === 'terminated';
  },
  extension() {
    return this.name().split('.').pop().toLowerCase();
  }
});

export { Files };
