import invoke from 'lodash.invoke';

export default {
  searchResultsNumber: 0,

  searchObject(prop, fields) {
    return this.searchQuery(invoke(this, prop), fields);
  },

  searchQuery(value, fields) {
    const searchObject = {};

    if (value) {
      const words = value.trim().split(' ');
      let r;
      try {
        r = new RegExp(`.*(${words.join(' ')}).*`, 'i');
      } catch (err) {
      } // ignore errors
      if (_.isArray(fields)) {
        fields           = _.map(fields, (field) => {
          const obj       = {};
          obj[field.name] = field.subField ? {$elemMatch: {[field.subField]: r}} : r;
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
