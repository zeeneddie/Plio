import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';
import IPOwner from '../../common/fields/improvementPlan.owner';


export default {
  field: 'improvementPlan.owner',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Treatment plan owner set to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          'Treatment plan owner changed from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          'Treatment plan owner removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set treatment plan\'s owner of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed treatment plan\'s owner of {{{docDesc}}} {{{docName}}} from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed treatment plan\'s owner of {{{docDesc}}} {{{docName}}}',
      },
    },
    Object.assign({}, IPOwner.notifications.personal, {
      text: '{{{userName}}} selected you as treatment plan owner for {{{docDesc}}} {{{docName}}}',
      title: 'You have been selected as treatment plan owner',
    }),
  ],
  data: IPOwner.data,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
