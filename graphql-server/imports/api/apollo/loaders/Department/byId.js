import DataLoader from 'dataloader';

export default ({ collections: { Departments } }) => new DataLoader(async ids =>
  Departments.find({ _id: { $in: ids } }).fetch());
