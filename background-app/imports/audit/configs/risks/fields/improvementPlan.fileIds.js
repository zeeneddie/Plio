import { Files } from '/imports/share/collections/files';
import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'improvementPlan.fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Treatment plan file "{{name}}" added',
        [ChangesKinds.ITEM_REMOVED]: 'Treatment plan file removed',
      },
    },
  ],
  notifications: [],
  data({ diffs }) {
    const _id = diffs['improvementPlan.fileIds'].item;

    const getFileName = () => {
      const { name } = Files.findOne({ _id }) || {};
      return name;
    };

    return { name: getFileName };
  },
};
