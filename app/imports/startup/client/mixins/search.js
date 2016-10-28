export default {
  searchResultsNumber: 0,

  searchObject(prop, fields, precise = false) {
    const searchObject = {};

    if (this[prop]()) {
      const words = this[prop]().trim().split(' ');
      let r;
      try {
        r = precise
          ? new RegExp(`^${this[prop]().trim()}$`, 'i')
          : new RegExp(`.*(${words.join(' ')}).*`, 'i');
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
