import { StandardTypes } from '/imports/share/collections/standards-types.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'typeId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Type set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Type changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Type removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set type of {{{docDesc}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed type of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed type of {{{docDesc}}}'
      }
    }
  ],
  data({ diffs: { typeId }, newDoc, user }) {
    const auditConfig = this;
    const { newValue, oldValue } = typeId;

    const getStandardTypeName = (_id) => {
      const { title } = StandardTypes.findOne({ _id }) || {};
      return title;
    };

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getStandardTypeName(newValue),
      oldValue: () => getStandardTypeName(oldValue)
    };
  },
  receivers: getReceivers
};
