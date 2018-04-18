import Errors from '../../errors';

export default async (query, collection) => {
  const doc = await collection.findOne(query);

  if (!doc) throw new Error(Errors.NOT_FOUND);

  return doc;
};
