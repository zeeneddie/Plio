import { StandardTypes } from '/imports/share/collections/standards-types';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'typeId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.typeId.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.typeId.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.typeId.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.typeId.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.typeId.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.typeId.text.removed',
      },
    },
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
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getStandardTypeName(newValue),
      oldValue: () => getStandardTypeName(oldValue),
    };
  },
  receivers: getReceivers,
};
