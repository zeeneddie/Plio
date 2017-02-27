import curry from 'lodash.curry';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { reduceC, cond, always, startsWith, find, compose } from '/imports/api/helpers';

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
