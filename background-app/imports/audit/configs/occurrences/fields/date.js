import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getLogData } from '../helpers.js';
import { getPrettyOrgDate } from '../../../utils/helpers.js';


export default {
  field: 'date',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'occurrences.fields.date.added',
        [ChangesKinds.FIELD_CHANGED]: 'occurrences.fields.date.changed',
        [ChangesKinds.FIELD_REMOVED]: 'occurrences.fields.date.removed',
      },
      logData: getLogData
    }
  ],
  notifications: [],
  data({ diffs: { date }, newDoc }) {
    const auditConfig = this;
    const { newValue, oldValue } = date;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      docName: () => auditConfig.docName(newDoc),
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId())
    };
  }
};
