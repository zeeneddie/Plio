import DataLoader from 'dataloader';

import { Risks } from '../../../../share/collections';

export default () => new DataLoader(async ids =>
  Promise.all(ids.map(id => Risks.find({ goalIds: id }).fetch())));
