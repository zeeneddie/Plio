import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { StandardStatuses, StringLimits } from '../constants.js';
import {
  BaseEntitySchema, OrganizationIdSchema,
  DeletedSchema, ViewedBySchema,
  ImprovementPlanSchema, getNotifySchema,
  standardStatusSchema, issueNumberSchema,
} from './schemas.js';


const optionalFields = new SimpleSchema([
  DeletedSchema,
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
      type: Object,
      optional: true,
    },
    'source1.fileId': {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    'source1.type': {
      type: String,
    },
    'source1.url': {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true,
    },
    'source1.htmlUrl': {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true,
    },
    source2: {
      type: Object,
      optional: true,
    },
    'source2.fileId': {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    'source2.type': {
      type: String,
    },
    'source2.url': {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true,
    },
    'source2.htmlUrl': {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
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
    standardNumber: {
      type: Number,
      min: 1,
      max: 1000,
      unique: true,
      optional: true,
    },
  },
]);

const StandardsSchema = new SimpleSchema([
  optionalFields,
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

const StandardsUpdateSchema = new SimpleSchema([optionalFields, {
  title: {
    type: String,
    min: StringLimits.title.min,
    max: StringLimits.title.max,
    optional: true,
  },
  typeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  sectionId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  nestingLevel: {
    type: Number,
    optional: true,
  },
  description: {
    type: String,
    optional: true,
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  issueNumber: {
    type: Number,
    optional: true,
  },
  status: {
    type: String,
    optional: true,
    allowedValues: _.keys(StandardStatuses),
  },
  improvementPlan: {
    type: ImprovementPlanSchema,
    optional: true
  },
}]);

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

export { StandardsSchema, StandardsUpdateSchema };
