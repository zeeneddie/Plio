import { Milestones } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getMilestoneDesc, getMilestoneName } from '../../../helpers/description';
import { getMilestoneUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: Milestones,
  collectionName: CollectionNames.MILESTONES,
  description: getMilestoneDesc(),
  getDocConfig: milestone => ({
    title: getMilestoneName(milestone),
    url: getMilestoneUrl({ organizationId: serialNumber }),
  }),
});
