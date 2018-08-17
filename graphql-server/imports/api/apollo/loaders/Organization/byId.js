import DataLoader from 'dataloader';

export default ({ collections: { Organizations } }) => new DataLoader(async ids =>
  Organizations.find({ _id: { $in: ids } }).fetch());
