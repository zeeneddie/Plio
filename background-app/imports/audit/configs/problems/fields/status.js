/* eslint-disable no-new */

import { ChangesKinds } from '../../../utils/changes-kinds';
import { capitalize } from '../../../../share/helpers';
import { ProblemsStatuses, ProblemIndexes } from '../../../../share/constants';
import { sendUpdateOfStandardsReminders } from '../helpers';

export default {
  field: 'status',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Status set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Status changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Status removed',
      },
    },
  ],
  notifications: [
    {
      shouldSendNotification({ diffs: { status: { newValue } } }) {
        return (
          newValue === ProblemIndexes.CLOSED_ACTIONS_COMPLETED ||
          newValue === ProblemIndexes.ACTIONS_VERIFIED_STANDARDS_REVIEWED
        );
      },
      text: 'Status of {{{docDesc}}} {{{docName}}} was changed to "{{{newValue}}}"',
      title: '{{{docDescCapitalized}}} {{{docName}}} closed',
      data({ diffs: { status }, newDoc, auditConfig }) {
        return {
          docDescCapitalized: capitalize(auditConfig.docDescription(newDoc)),
          newValue: ProblemsStatuses[status.newValue],
        };
      },
      emailTemplateData({ newDoc, auditConfig }) {
        return {
          button: {
            label: 'View document',
            url: auditConfig.docUrl(newDoc),
          },
        };
      },
      receivers({ newDoc }) {
        return [newDoc.originatorId];
      },
    },
  ],
  data({ diffs: { status } }) {
    const { newValue, oldValue } = status;

    return {
      newValue: ProblemsStatuses[newValue],
      oldValue: ProblemsStatuses[oldValue],
    };
  },
  trigger({ diffs: { status: { newValue } }, ...args }) {
    if (newValue === ProblemIndexes.ACTIONS_VERIFIED_STANDARDS_REVIEWED) {
      sendUpdateOfStandardsReminders(args);
    }
  },
};
