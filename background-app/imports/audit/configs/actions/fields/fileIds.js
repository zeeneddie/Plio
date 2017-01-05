import { ChangesKinds } from '../../../utils/changes-kinds';
import { Files } from '/imports/share/collections/files';
import { getReceivers } from '../helpers';


export default {
  field: 'fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'File "{{name}}" added',
        [ChangesKinds.ITEM_REMOVED]: 'File removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{userName}} added file "{{name}}" to {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{userName}} removed file from {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { fileIds } }) {
    const { item: _id } = fileIds;

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
