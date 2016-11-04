export default {
  searchResultsNumber: 0,

  searchObject(prop, fields, precise = false) {
    const searchObject = {};

    const value = (this[prop] && this[prop]() || '').trim();

    if (value) {
      let r;

      try {
        console.log(value);
        r = precise
          ? new RegExp(`(\d\.?)*${value}$`, 'i')
          : new RegExp(`.*(${value}).*`, 'i');
      } catch (err) {
      } // ignore errors

      if (_.isArray(fields)) {
        fields = _.map(fields, (field) => {
          const obj = {};

          obj[field.name] = field.subField
            ? {$elemMatch: {[field.subField]: r}}
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
  }
};
