import JSON from 'graphql-type-json';
import {
  GraphQLDate,
  GraphQLTime as Time,
  GraphQLDateTime as DateTime,
} from 'graphql-iso-date';

export default {
  JSON,
  Time,
  DateTime,
  Date: {
    ...GraphQLDate,
    serialize(value) {
      const date = GraphQLDate.serialize(value);
      return new Date(date).getTime();
    },
  },
};
