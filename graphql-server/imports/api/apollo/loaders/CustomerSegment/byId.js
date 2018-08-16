import DataLoader from 'dataloader';

export default ({ collections: { CustomerSegments } }) => new DataLoader(async ids =>
  CustomerSegments.find({ _id: { $in: ids } }).fetch());
