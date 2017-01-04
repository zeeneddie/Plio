import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyOrgDate } from '../../../utils/helpers';


export default {
  field: 'analysis.completedAt',
  logs: [
    {
      shouldCreateLog({ diffs }) {
        return !diffs['analysis.status'];
      },
      message: {
        [ChangesKinds.FIELD_ADDED]: 'problems.fields.analysis.completedAt.added',
        [ChangesKinds.FIELD_CHANGED]: 'problems.fields.analysis.completedAt.changed',
        [ChangesKinds.FIELD_REMOVED]: 'problems.fields.analysis.completedAt.removed',
      },
    },
  ],
  notifications: [],
  data({ diffs, newDoc }) {
    const { newValue, oldValue } = diffs['analysis.completedAt'];
    const orgId = () => this.docOrgId(newDoc);

    return {
      newValue: () => getPrettyOrgDate(newValue, orgId()),
      oldValue: () => getPrettyOrgDate(oldValue, orgId()),
    };
  },
};
