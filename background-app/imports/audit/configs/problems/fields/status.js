import { ProblemsStatuses } from '/imports/share/constants.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'status',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Status set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Status changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Status removed'
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
      text: 'Status of {{{docDesc}}} was changed to "{{newValue}}"',
      title: '{{{docDesc}}} closed',
      data({ diffs: { status }, newDoc }) {
        const auditConfig = this;

        return {
          docDesc: () => auditConfig.docDescription(newDoc),
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
