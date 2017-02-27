import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import curry from 'lodash.curry';

import { StandardStatuses, StringLimits } from '../constants';
import { reduceC, cond, always, startsWith, flattenMap } from '/imports/api/helpers';
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

const optionalFields = new SimpleSchema([
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

const StandardsUpdateSchema = new SimpleSchema({
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
    optional: true,
  },
});

const reduceKeys = curry((defaultValue, keys, field) => {
  const reducer = (_keys, _key) => cond(
    startsWith(field),
    key => _keys.concat(key),
    always(_keys),
  )(_key);

  return reduceC(reducer, defaultValue, keys);
});

const UpdateSchema = ((() => {
  const reduceStdKeys = reduceKeys([], Object.keys(StandardsSchema._schema));
  const keys = ['improvementPlan', 'source1', 'source2'].reduce((acc, key) =>
    acc.concat(reduceStdKeys(key)), []);

  const fields = [
    'title',
    'nestingLevel',
    'description',
    'sectionId',
    'typeId',
    'uniqueNumber',
    'owner',
    'issueNumber',
    'status',
    'departmentsIds',
    'departmentsIds.$',
    'source1',
    'source1.fileId',
    'source1.type',
    'source1.url',
    'source1.htmlUrl',
    'source2',
    'source2.fileId',
    'source2.type',
    'source2.url',
    'source2.htmlUrl',
    'notify',
    'notify.$',
    ...keys,
  ];

  const reducer = (definition, field) => ({
    ...definition,
    [field]: {
      ...StandardsSchema.schema(field),
      optional: true,
    },
  });

  const schemaDefinition = fields.reduce(reducer, {});

  return new SimpleSchema(schemaDefinition);
})());

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

export { StandardsSchema, UpdateSchema };
