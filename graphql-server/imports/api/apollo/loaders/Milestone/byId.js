import DataLoader from 'dataloader';

import { Milestones } from '../../../../share/collections';

export default () => new DataLoader(async ids =>
  Promise.all(ids.map(_id => Milestones.findOne({ _id }))));
