import { Actions, WorkItems } from '../../../share/collections';
import { CollectionNames } from '../../../share/constants';
import { getActionDesc, getActionName } from '../../../helpers/description';
import { getWorkItemUrl } from '../../../helpers/url';

export default ({ organization: { serialNumber } }) => ({
  collection: Actions,
  collectionName: CollectionNames.ACTIONS,
  description: getActionDesc(),
  getDocConfig: async (action) => {
    const query = { 'linkedDoc._id': action._id };
    const options = {
      fields: { _id: 1 },
      sort: { createdAt: -1 },
    };
    const workItem = await WorkItems.findOne(query, options);

    return {
      title: getActionName(action),
      url: workItem ? getWorkItemUrl(serialNumber, workItem._id) : undefined,
    };
  },
});
