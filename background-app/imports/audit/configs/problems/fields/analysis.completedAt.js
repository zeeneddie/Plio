import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate } from '../../../utils/helpers.js';


export default {
  field: 'analysis.completedAt',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['analysis.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Root cause analysis date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Root cause analysis date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Root cause analysis date removed'
      }
    }
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { newValue, oldValue } = diffs['analysis.completedAt'];
    const orgId = () => this.docOrgId(newDoc);

    return {
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId())
    };
  }
};
