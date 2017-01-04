import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyOrgDate } from '../../../utils/helpers';


export default {
  field: 'updateOfStandards.completedAt',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['updateOfStandards.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'problems.fields.updateOfStandards.completedAt.added',
        [ChangesKinds.FIELD_CHANGED]:
          'problems.fields.updateOfStandards.completedAt.changed',
        [ChangesKinds.FIELD_REMOVED]:
          'problems.fields.updateOfStandards.completedAt.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { newValue, oldValue } = diffs['updateOfStandards.completedAt'];
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId()),
    };
  },
};
