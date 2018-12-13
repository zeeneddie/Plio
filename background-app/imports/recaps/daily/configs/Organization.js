import { Organizations } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';

export default () => ({
  collection: Organizations,
  collectionName: CollectionNames.ORGANIZATIONS,
  description: 'Organization settings',
  title: 'Organization settings were updated:',
});
