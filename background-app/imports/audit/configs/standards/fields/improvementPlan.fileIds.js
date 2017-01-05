import { Files } from '/imports/share/collections/files';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'improvementPlan.fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'Improvement plan file "{{name}}" added',
        [ChangesKinds.ITEM_REMOVED]: 'Improvement plan file removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} added file "{{name}}" to improvement plan of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} removed file from improvement plan of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
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
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
