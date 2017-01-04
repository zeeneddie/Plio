import { Files } from '/imports/share/collections/files';
import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'fileIds',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'common.fields.fileIds.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'common.fields.fileIds.item-removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { fileIds } }) {
    const { item: _id } = fileIds;
    const file = () => Files.findOne({ _id }) || {};

    return {
      name: () => file().name,
    };
  },
};
