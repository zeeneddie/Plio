import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate } from '../../../utils/helpers.js';


export default {
  field: 'identifiedAt',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Identified at set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Identified at changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Identified at removed'
      }
    }
  ],
  notifications: [],
  data({ diffs: { identifiedAt }, newDoc }) {
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      newValue: () => getPrettyOrgDate(identifiedAt.newValue, orgId()),
      oldValue: () => getPrettyOrgDate(identifiedAt.oldValue, orgId())
    };
  }
};
