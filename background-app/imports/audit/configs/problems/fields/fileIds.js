import { Files } from '/imports/share/collections/files';
import { ChangesKinds } from '../../../utils/changes-kinds';


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
  notifications: [],
  data({ diffs: { fileIds } }) {
    const { item: _id } = fileIds;

    const getFileName = () => {
      const { name } = Files.findOne({ _id }) || {};
      return name;
    };

    return { name: getFileName };
  },
};
