import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { StringLimits } from '../constants';
import {
  BaseEntitySchema, OrganizationIdSchema,
  DeletedSchema, ViewedBySchema,
  ImprovementPlanSchema, getNotifySchema,
  standardStatusSchema, issueNumberSchema,
  ReviewSchema,
} from './schemas';

const SourceSchema = new SimpleSchema({
  fileId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  type: {
    type: String,
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

const OptionalSchema = new SimpleSchema([
  DeletedSchema,
  ReviewSchema,
  ViewedBySchema,
  issueNumberSchema,
  getNotifySchema('owner'),
  {
    description: {
      type: String,
      optional: true,
    },
    approved: {
      type: Boolean,
      optional: true,
    },
    approvedAt: {
      type: Date,
      optional: true,
    },
    notes: {
      type: String,
      optional: true,
    },
    departmentsIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      defaultValue: [],
      optional: true,
    },
    source1: {
      type: SourceSchema,
      optional: true,
    },
    source2: {
      type: SourceSchema,
      optional: true,
    },
    lessons: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    improvementPlan: {
      type: ImprovementPlanSchema,
      optional: true,
    },
    uniqueNumber: {
      type: Number,
      min: 1,
      max: 10000,
      optional: true,
    },
  },
]);

const StandardsSchema = new SimpleSchema([
  OptionalSchema,
  BaseEntitySchema,
  OrganizationIdSchema,
  standardStatusSchema,
  {
    title: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
    },
    typeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    sectionId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    nestingLevel: {
      type: Number,
    },
    owner: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  },
]);

const invalidUrlMessage = 'The source file url link is not valid';

StandardsSchema.messages({
  'regEx source1.url': [{
    exp: SimpleSchema.RegEx.Url,
    msg: invalidUrlMessage,
  }],
  'regEx source2.url': [{
    exp: SimpleSchema.RegEx.Url,
    msg: invalidUrlMessage,
  }],
});

export { StandardsSchema };
