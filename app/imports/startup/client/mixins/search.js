import invoke from 'lodash.invoke';
import { _ } from 'meteor/underscore';

import { createSearchRegex } from '/imports/api/helpers';

export default {
  searchResultsNumber: 0,

  searchObject(prop, fields) {
    return this.searchQuery(invoke(this, prop), fields);
  },

  searchQuery(input, fields, isPrecise = false) {
    const searchObject = {};
    const value = `${input}`.trim();

    if (value) {
      const r = createSearchRegex(value, isPrecise);

      if (_.isArray(fields)) {
        const mappedFields = _.map(fields, (field) => {
          const obj = {};

          obj[field.name] = field.subField
            ? { $elemMatch: { [field.subField]: r } }
            : r;

          return obj;
        });
        searchObject.$or = mappedFields;
      } else {
        searchObject[fields] = r;
      }
    }

    return searchObject;
  },

  searchResultsText() {
    return `${this.searchResultsNumber()} matching results`;
  },
};
