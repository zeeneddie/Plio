import DataLoader from 'dataloader';

import { Risks } from '../../../../share/collections';

export default () => new DataLoader(async ids =>
  Promise.all(ids.map(_id => Risks.findOne({ _id }))));
