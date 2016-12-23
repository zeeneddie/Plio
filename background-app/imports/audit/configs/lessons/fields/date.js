import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate } from '../../../utils/helpers.js';
import { getLogData } from '../helpers.js';


export default {
  field: 'date',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          '{{docDesc}} created date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{docDesc}} created date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{docDesc}} created date removed'
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
