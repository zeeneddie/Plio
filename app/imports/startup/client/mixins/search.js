import invoke from 'lodash.invoke';

export default {
  searchResultsNumber: 0,

  searchObject(prop, fields) {
    return this.searchQuery(invoke(this, prop), fields);
  },

  searchQuery(input, fields, precise = false) {
    const searchObject = {};
    let value = `${input}`.trim();

    if (value) {
      let r;

      try {
        if (precise) {
          value = value.replace(/"/g, '');
          r = new RegExp(`.*(${value}).*`, 'i');
        } else {
          r = value.split(' ')
              .filter(word => !!word)
              .map(word => `(?=.*\\b.*${word}.*\\b)`)
              .join('');

          r = new RegExp(`^${r}.*$`, 'i');
        }
      } catch (err) {
      } // ignore errors

      if (_.isArray(fields)) {
        fields = _.map(fields, (field) => {
          const obj = {};

          obj[field.name] = field.subField
            ? { $elemMatch: { [field.subField]: r } }
            : r;

          return obj;
        });
        searchObject.$or = fields;
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
