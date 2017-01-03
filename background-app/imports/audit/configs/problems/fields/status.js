import { ProblemsStatuses } from '/imports/share/constants.js';
import { capitalize } from '/imports/share/helpers.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'status',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'problems.fields.status.added',
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.status.changed',
        [ChangesKinds.FIELD_REMOVED]: 'problems.fields.status.removed',
      }
    }
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { status: { newValue } } }) {
        // 18 - Closed - action(s) completed
        // 19 - Closed - action(s) verified, standard(s) reviewed
        return (newValue === 18) || (newValue === 19);
      },
      text: 'problems.fields.status.closed-status-notification.text.changed',
      title: 'problems.fields.status.closed-status-notification.title.changed',
      data({ diffs: { status }, newDoc }) {
        const auditConfig = this;

        return {
          docDescCapitalized: () => capitalize(auditConfig.docDescription(newDoc)),
          docDesc: () => auditConfig.docDescription(newDoc),
          docName: () => auditConfig.docName(newDoc),
          newValue: () => ProblemsStatuses[status.newValue]
        };
      },
      emailTemplateData({ newDoc }) {
        return {
          button: {
            label: 'View document',
            url: this.docUrl(newDoc)
          }
        };
      },
      receivers({ newDoc }) {
        return [newDoc.identifiedBy];
      }
    }
  ],
  data({ diffs: { status } }) {
    const { newValue, oldValue } = status;

    return {
      newValue: () => ProblemsStatuses[newValue],
      oldValue: () => ProblemsStatuses[oldValue]
    };
  }
};
