import DataLoader from 'dataloader';

import { LessonsLearned } from '../../../../share/collections';

export default new DataLoader(async ids =>
  Promise.all(ids.map(id => LessonsLearned.find({ documentId: id }).fetch())));
