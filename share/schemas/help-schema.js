import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';

import { BaseEntitySchema, DeletedSchema, OrganizationIdSchema } from './schemas';
import { HelpSections, SourceTypes } from '../constants';


const sourceSchema = new SimpleSchema({
  fileId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  type: {
    type: String,
    allowedValues: _(SourceTypes).values(),
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  htmlUrl: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
});

export const HelpSchema = new SimpleSchema([
  BaseEntitySchema,
  DeletedSchema,
  OrganizationIdSchema,
  {
    title: {
      type: String,
    },
    section: {
      type: Number,
      allowedValues: _(HelpSections).keys().map(val => parseInt(val, 10)),
    },
    source: {
      type: sourceSchema,
    },
  },
]);
