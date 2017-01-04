import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyOrgDate } from '../../../utils/helpers';


export default {
  field: 'identifiedAt',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'problems.fields.identifiedAt.added',
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.identifiedAt.changed',
        [ChangesKinds.FIELD_REMOVED]: 'problems.fields.identifiedAt.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { identifiedAt }, newDoc }) {
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      newValue: () => getPrettyOrgDate(identifiedAt.newValue, orgId()),
      oldValue: () => getPrettyOrgDate(identifiedAt.oldValue, orgId()),
    };
  },
};
