import { Goals } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getGoalDesc, getGoalName } from '../../../helpers/description';
import { getGoalUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: Goals,
  collectionName: CollectionNames.GOALS,
  description: getGoalDesc(),
  getDocConfig: goal => ({
    title: getGoalName(goal),
    url: getGoalUrl({ organizationId: serialNumber }),
  }),
});
