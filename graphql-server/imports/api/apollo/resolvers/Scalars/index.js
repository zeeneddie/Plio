import JSON from 'graphql-type-json';
import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
} from 'graphql-iso-date';

export default {
  JSON,
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: {
    ...GraphQLDateTime,
    serialize(value) {
      const date = GraphQLDateTime.serialize(value);
      return new Date(date).getTime();
    },
  },
};
