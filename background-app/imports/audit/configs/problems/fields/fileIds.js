import { Files } from '/imports/share/collections/files.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'File "{{name}}" added',
        [ChangesKinds.ITEM_REMOVED]: 'File removed'
      }
    }
  ],
  notifications: [],
  data({ diffs: { fileIds } }) {
    const { item:_id } = fileIds;
    const file = () => Files.findOne({ _id }) || {};

    return {
      name: () => file().name
    };
  }
};
