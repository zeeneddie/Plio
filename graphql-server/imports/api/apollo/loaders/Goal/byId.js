import DataLoader from 'dataloader';

import { Goals } from '../../../../share/collections';

export default () => new DataLoader(async ids =>
  Promise.all(ids.map(_id => Goals.findOne({ _id }))));
