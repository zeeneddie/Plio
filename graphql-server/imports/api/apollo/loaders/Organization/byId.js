import DataLoader from 'dataloader';
import { Organizations } from '../../../../share/collections';

export default new DataLoader(async ids => Organizations.find({ _id: { $in: ids } }).fetch());
