import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'description',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'common.fields.description.added',
        [ChangesKinds.FIELD_CHANGED]: 'common.fields.description.changed',
        [ChangesKinds.FIELD_REMOVED]: 'common.fields.description.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'common.fields.description.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'common.fields.description.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'common.fields.description.text.removed',
      },
    },
  ],
  data({ newDoc, user }) {
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
    };
  },
  receivers: getReceivers,
};
