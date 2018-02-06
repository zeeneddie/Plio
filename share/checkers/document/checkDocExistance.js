import { Meteor } from 'meteor/meteor';
import Errors from '../../errors';

export default async (query, collection) => {
  const doc = await collection.findOne(query);

  if (!doc) throw new Meteor.Error(404, Errors.NOT_FOUND);

  return doc;
};
