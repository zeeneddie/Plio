import DataLoader from 'dataloader';

export default ({ collections: { Goals } }) => new DataLoader(async ids =>
  Goals.find({ _id: { $in: ids } }).fetch());
