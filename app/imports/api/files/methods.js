import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import FilesService from './files-service.js';
import { FileIdsSchema, RequiredSchema } from './files-schema.js';
import { IdSchema, DocumentIdSchema, OrganizationIdSchema, UrlSchema, ProgressSchema } from '../schemas.js';

// [TODO] Advanced validations
export const insert = new ValidatedMethod({
  name: 'Files.insert',

  validate: new SimpleSchema([RequiredSchema]).validator(),

  run({ ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create files');
    }

    return FilesService.insert({ ...args });
  }
});

export const updateProgress = new ValidatedMethod({
  name: 'Files.updateProgress',

  validate: new SimpleSchema([IdSchema, ProgressSchema]).validator(),

  run({ _id, progress }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update files');
    }

    return FilesService.update({ _id, progress });
  }
});

export const updateUrl = new ValidatedMethod({
  name: 'Files.updateUrl',

  validate: new SimpleSchema([IdSchema, UrlSchema]).validator(),

  run({ _id, url }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update files');
    }

    return FilesService.update({ _id, url });
  }
});

export const remove = new ValidatedMethod({
  name: 'Files.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot remove files');
    }

    return FilesService.remove({ _id });
  }
});
