import DataLoader from 'dataloader';

export default ({ collections: { RiskTypes } }) => new DataLoader(async ids =>
  RiskTypes.find({ _id: { $in: ids } }).fetch());
