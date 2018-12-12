import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { BaseEntitySchema, OrganizationIdSchema, ProgressSchema } from './schemas';
import { FILE_STATUS_MAP } from '../constants';

export const RequiredSchema = new SimpleSchema([
  OrganizationIdSchema,
  {
    name: {
      type: String,
    },
    extension: {
      type: String,
      optional: true,
      autoValue() {
        if (this.isInsert) {
          const name = this.field('name').value;
          return name.split('.').pop().toLowerCase();
        }
        return this.unset();
      },
    },
  },
]);

export const FileIdsSchema = new SimpleSchema([
  BaseEntitySchema,
  RequiredSchema,
  ProgressSchema,
  {
    url: {
      type: String,
      defaultValue: '',
      optional: true,
    },

    status: {
      type: String,
      defaultValue: FILE_STATUS_MAP.IN_PROGRESS,
      allowedValues: _.values(FILE_STATUS_MAP),
    },
  },
]);
