import { StandardTypes } from '/imports/share/collections/standards-types';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'typeId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Type set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Type changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Type removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set type of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed type of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed type of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { typeId } }) {
    const { newValue, oldValue } = typeId;

    const getStandardTypeName = (_id) => {
      const { title } = StandardTypes.findOne({ _id }) || {};
      return title;
    };

    return {
      newValue: () => getStandardTypeName(newValue),
      oldValue: () => getStandardTypeName(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
