import DataLoader from 'dataloader';

export default ({ collections: { ValuePropositions } }) => new DataLoader(async ids =>
  ValuePropositions.find({ _id: { $in: ids } }).fetch());
