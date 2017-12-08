import { Mongo } from 'meteor/mongo';

const Counter = {};
Counter.collection = new Mongo.Collection('counters-collection');

Counter.get = (name) => {
  const doc = Counter.collection.findOne(name);

  return doc ? doc.count : 0;
};

export default Counter;
