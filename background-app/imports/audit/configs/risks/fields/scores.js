import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getPrettyOrgDate, getUserFullNameOrEmail } from '../../../utils/helpers.js';


export default {
  field: 'scores',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]:
          'Risk score added: value - {{value}}, scored by {{userName}} on {{date}}',
        [ChangesKinds.ITEM_REMOVED]:
          'Risk score removed: value - {{value}}, scored by {{userName}} on {{date}}'
      }
    }
  ],
  notifications: [],
  data({ diffs: { scores }, newDoc }) {
    const { item: { value, scoredAt, scoredBy } } = scores;
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      value: () => value,
      date: () => getPrettyOrgDate(scoredAt, orgId()),
      userName: () => getUserFullNameOrEmail(scoredBy)
    };
  }
};
