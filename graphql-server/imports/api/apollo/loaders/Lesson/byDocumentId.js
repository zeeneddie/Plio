import DataLoader from 'dataloader';

export default ({ collections: { LessonsLearned } }) => new DataLoader(async ids =>
  Promise.all(ids.map(documentId => LessonsLearned.find({ documentId }).fetch())));
