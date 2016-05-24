const Counter = {};
Counter.collection = new Mongo.Collection('counters-collection');

Counter.get = (name) => {
  const doc = Counter.collection.findOne(name);
  if (doc) {
    return doc.count;
  } else {
    return 0;
  }
}

export default Counter;
