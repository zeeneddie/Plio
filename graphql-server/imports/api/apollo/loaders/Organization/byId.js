import DataLoader from 'dataloader';
import { Organizations } from '../../../../share/collections';

export default () => new DataLoader(async ids =>
  Promise.all(ids.map(_id => Organizations.findOne({ _id }))));
