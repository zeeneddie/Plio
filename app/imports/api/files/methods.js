import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import FilesService from './files-service.js';
import { Files } from '/imports/share/collections/files.js';
import { RequiredSchema } from '/imports/share/schemas/files-schema.js';
import {
  IdSchema, UrlSchema,
  ProgressSchema, ErrorSchema
} from '/imports/share/schemas/schemas.js';
import { checkOrgMembership, checkDocExistance } from '/imports/api/checkers.js';
import { nameIsAllowed } from './validators.js';
import { FILE_NAME_NOT_VALID } from './errors.js';

const onUpdateCheck = ({ _id, userId }) => {
	const { organizationId } = checkDocExistance(Files, { _id });

  checkOrgMembership(userId, organizationId);
	return true;
};

// [TODO] Advanced validations
export const insert = new ValidatedMethod({
  name: 'Files.insert',

  validate(args) {
    new SimpleSchema([RequiredSchema]).validator(args);

    if (!nameIsAllowed(args.name)) throw FILE_NAME_NOT_VALID;
  },

  run({ ...args }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create files');
    }

    checkOrgMembership(userId, args.organizationId);
    return FilesService.insert({ ...args });
  }
});

export const updateProgress = new ValidatedMethod({
  name: 'Files.updateProgress',

  validate: new SimpleSchema([IdSchema, ProgressSchema]).validator(),

  run({ _id, progress }) {
    const userId = this.userId;

    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update files');
    }

    onUpdateCheck({ _id, userId });
    return FilesService.update({ _id, progress });
  }
});

export const updateUrl = new ValidatedMethod({
  name: 'Files.updateUrl',

  validate: new SimpleSchema([IdSchema, UrlSchema]).validator(),

  run({ _id, url }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update files');
    }

    onUpdateCheck({ _id, userId });
    return FilesService.update({ _id, url, status: 'completed' });
  }
});

export const terminateUploading = new ValidatedMethod({
  name: 'Files.terminateUploading',

  validate: new SimpleSchema([IdSchema, ErrorSchema]).validator(),

  run({ _id, error }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update files');
    }

    onUpdateCheck({ _id, userId });
    return FilesService.update({ _id, status: 'failed' });
  }
});

export const remove = new ValidatedMethod({
  name: 'Files.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    const userId = this.userId;

    if (!userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot remove files');
    }

    onUpdateCheck({ _id, userId });
    return FilesService.remove({ _id });
  }
});
