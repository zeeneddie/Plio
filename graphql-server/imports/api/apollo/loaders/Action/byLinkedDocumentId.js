import DataLoader from 'dataloader';

import { Actions } from '../../../../share/collections';

export default () => new DataLoader(async ids =>
  Promise.all(ids.map(id => Actions.find({ 'linkedTo.documentId': id }).fetch())));
