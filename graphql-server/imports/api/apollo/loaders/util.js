import DataLoader from 'dataloader';
import sift from 'sift';

export const batch = collection => async (queries) => {
  const docs = await collection.find({ $or: queries }).fetch();
  return queries.map(query => sift(query, docs));
};

export const createQueryLoader = collection => new DataLoader(batch(collection), {
  cacheKeyFn: query => JSON.stringify(query),
});
