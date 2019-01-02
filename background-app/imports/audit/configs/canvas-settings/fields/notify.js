import { getReceivers } from '../../organizations/helpers';
import OrgAuditConfig from '../../organizations/org-audit-config';
import notify from '../../common/fields/notify';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { CollectionNames } from '../../../../share/constants';

export default {
  field: 'notify',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          '{{{user}}} was added to the canvas screen notification list',
        [ChangesKinds.ITEM_REMOVED]:
          '{{{user}}} was removed from the canvas screen notification list',
      },
      logData: ({ organization }) => ({
        documentId: organization._id,
        collection: CollectionNames.ORGANIZATIONS,
      }),
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.ITEM_ADDED]:
          '{{{userName}}} added {{{user}}} to the canvas screen notification list ' +
          'of {{{docDesc}}} {{{docName}}}',
        [ChangesKinds.ITEM_REMOVED]:
          '{{{userName}}} removed {{{user}}} from the canvas screen notification list ' +
          'of {{{docDesc}}} {{{docName}}}',
      },
      title: '{{{userName}}} updated {{{docDesc}}} {{{docName}}}',
    },
    {
      ...notify.notifications.personal,
      text: '{{{userName}}} added you to the canvas screen notification list ' +
      'of {{{docDesc}}} {{{docName}}}',
    },
  ],
  data: (args) => {
    const { organization } = args;
    return {
      ...notify.data(args),
      docName: OrgAuditConfig.docName(organization),
      docDesc: OrgAuditConfig.docDescription(organization),
    };
  },
  receivers({ user, organization }) {
    return getReceivers(organization, user);
  },
};
