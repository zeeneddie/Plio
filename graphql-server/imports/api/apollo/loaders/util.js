import DataLoader from 'dataloader';
import sift from 'sift';

export const batch = (collection, func) => async (queries) => {
  let docs = await collection.find({ $or: queries }).fetch();
  if (func) docs = func(docs);
  return queries.map(query => sift(query, docs));
};

export const createQueryLoader = (collection, func) => new DataLoader(batch(collection, func), {
  cacheKeyFn: query => JSON.stringify(query),
});
