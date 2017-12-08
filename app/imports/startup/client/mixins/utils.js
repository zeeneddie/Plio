import { Mongo } from 'meteor/mongo';

export default {
  capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  },
  lowercase(str) {
    return str ? str.charAt(0).toLowerCase() + str.slice(1) : '';
  },
  round(num) {
    if (num >= 1000000) {
      return `${parseFloat((num / 1000000).toFixed(1))}M`;
    } else if (num >= 1000) {
      return `${parseFloat((num / 1000).toFixed(1))}K`;
    }
    return num;
  },
  getCollectionInstance(_id, ...collections) {
    return collections.find(collection => collection instanceof Mongo.Collection
        && collection.findOne({ _id }));
  },
  chooseOne(predicate) {
    return (i1, i2) => predicate ? i1 : i2;
  },
  toArray(arrayLike = []) {
    const array = arrayLike.hasOwnProperty('collection') ? arrayLike.fetch() : arrayLike;
    return Array.from(array || []);
  },
};
