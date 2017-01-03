import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';

export default {
  field: 'planInPlace',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.planInPlace.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.planInPlace.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.planInPlace.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'actions.fields.planInPlace.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'actions.fields.planInPlace.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'actions.fields.planInPlace.text.removed',
      },
    },
  ],
  data({ diffs: { planInPlace }, newDoc, user }) {
    const { newValue, oldValue } = planInPlace;
    const auditConfig = this;

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => newValue,
      oldValue: () => oldValue,
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
