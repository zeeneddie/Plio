import DataLoader from 'dataloader';
import { Files } from '../../../../share/collections';

export default () => new DataLoader(async ids =>
  Promise.all(ids.map(_id => Files.findOne({ _id }))));
