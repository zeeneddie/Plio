import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate } from '../../../utils/helpers.js';


export default {
  field: 'updateOfStandards.completedAt',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Update of standards date set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Update of standards date changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Update of standards date removed'
      }
    }
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { newValue, oldValue } = diffs['updateOfStandards.completedAt'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId())
    };
  }
};
