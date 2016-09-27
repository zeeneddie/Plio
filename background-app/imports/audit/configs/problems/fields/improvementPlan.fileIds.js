import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'improvementPlan.fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Improvement plan file "{{name}}" added',
        [ChangesKinds.ITEM_REMOVED]: 'Improvement plan file removed'
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
