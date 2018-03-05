import DataLoader from 'dataloader';
import sift from 'sift';

import { Milestones } from '../../../../share/collections';

export const batchMilestones = async (queries) => {
  const milestones = await Milestones.find({ $or: queries }).fetch();
  return queries.map(query => sift(query, milestones));
};

export default () => new DataLoader(batchMilestones, {
  cacheKeyFn: query => JSON.stringify(query),
});
