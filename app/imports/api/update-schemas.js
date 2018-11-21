import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import curry from 'lodash.curry';

import { IdSchema, idSchemaDoc } from '/imports/share/schemas/schemas';
import { reduceC, cond, always, startsWith, find, compose } from '/imports/api/helpers';

const idSchemaDefOpt = { ...idSchemaDoc, optional: true };

// getAllRelatedSchemaKeys(Object.keys(SomeSchema._schema), ['departmentsIds', 'improvementPlan']);
// => ['departmentsIds', 'departmentsIds.$', 'improvementPlan', 'improvementPlan.type', ...];
export const getAllRelatedSchemaKeys = curry((schemaKeys, lookupKeys) => {
  const reducer = (keys, _key) => cond(
    key => find(lookupKey => startsWith(lookupKey, key), lookupKeys),
    key => keys.concat(key),
    always(keys),
  )(_key);

  return reduceC(reducer, [], schemaKeys);
});

// getSchemaDefinition(StandardsSchema, { optional: true })(['title', 'description']);
// => { title: { type: String, ... }, ... };
export const getSchemaDefinition = (schema, extra) => reduceC(
  (definition, key, i, array) => ({
    ...definition,
    [key]: {
      ...schema.schema(key),
      ...cond(
        always(typeof extra === 'function'),
        extra,
        always(extra),
      )(key, definition, i, array),
    },
  }),
  {},
);

// getSchema(StandardsSchema, { optional: true })(['title', 'description']);
// => SimpleSchema { ... }
export const getSchemaFrom = (schema, extra) => compose(
  schemaDefinition => new SimpleSchema(schemaDefinition),
  getSchemaDefinition(schema, extra),
  getAllRelatedSchemaKeys(Object.keys(schema._schema)),
);

export const getMongoUpdateSchema = schema => new SimpleSchema({
  options: {
    type: schema,
    optional: true,
  },
  query: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});

export const withOptionalIfNotNested = key => (key.includes('$') ? {} : { optional: true });

export const fileIdsSchema = new SimpleSchema({ fileIds: idSchemaDefOpt });
export const fileIds = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: fileIdsSchema,
  },
  $pull: {
    optional: true,
    type: fileIdsSchema,
  },
});

export const improvementPlan = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: new SimpleSchema({
      'improvementPlan.reviewDates': {
        optional: true,
        type: new SimpleSchema([
          IdSchema,
          {
            date: {
              type: Date,
            },
          },
        ]),
      },
      'improvementPlan.fileIds': idSchemaDefOpt,
    }),
  },
  $pull: {
    optional: true,
    type: new SimpleSchema({
      'improvementPlan.reviewDates': {
        type: IdSchema,
        optional: true,
      },
      'improvementPlan.fileIds': idSchemaDefOpt,
    }),
  },
});

const departmentIdsSchema = new SimpleSchema({ departmentsIds: idSchemaDefOpt });
export const departmentsIds = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: departmentIdsSchema,
  },
  $pull: {
    optional: true,
    type: departmentIdsSchema,
  },
});

const projectIdsSchema = new SimpleSchema({ projectIds: idSchemaDefOpt });
export const projectIds = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: projectIdsSchema,
  },
  $pull: {
    optional: true,
    type: projectIdsSchema,
  },
});

const notifySchema = new SimpleSchema({ notify: idSchemaDefOpt });
export const notify = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: notifySchema,
  },
  $pull: {
    optional: true,
    type: notifySchema,
  },
});

const standardIdsSchema = new SimpleSchema({ standardsIds: idSchemaDefOpt });
export const standardsIds = new SimpleSchema({
  $addToSet: {
    optional: true,
    type: standardIdsSchema,
  },
  $pull: {
    optional: true,
    type: standardIdsSchema,
  },
});
