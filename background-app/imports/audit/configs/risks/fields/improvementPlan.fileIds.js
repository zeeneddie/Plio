import { Files } from '/imports/share/collections/files.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'improvementPlan.fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'risks.fields.improvementPlan.fileIds.item-added',
        [ChangesKinds.ITEM_REMOVED]:
          'risks.fields.improvementPlan.fileIds.item-removed',
      }
    }
  ],
  notifications: [],
  data({ diffs }) {
    const _id = diffs['improvementPlan.fileIds'].item;
    const file = () => Files.findOne({ _id }) || {};

    return {
      name: () => file().name
    };
  }
};
