import { Files } from '/imports/share/collections/files';
import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Improvement plan file "{{name}}" added',
        [ChangesKinds.ITEM_REMOVED]: 'Improvement plan file removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} added file "{{name}}" to improvement plan of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} removed file from improvement plan of {{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data({ diffs }) {
    const _id = diffs['improvementPlan.fileIds'].item;

    const getFileName = () => {
      const { name } = Files.findOne({ _id }) || {};
      return name;
    };

    return {
      name: getFileName,
    };
  },
};
