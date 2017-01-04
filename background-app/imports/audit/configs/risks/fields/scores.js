import { ChangesKinds } from '../../../utils/changes-kinds';
import { getPrettyOrgDate, getUserFullNameOrEmail } from '../../../utils/helpers';


export default {
  field: 'scores',
  logs: [
    {
      message: {
        [ChangesKinds.ITEM_ADDED]: 'risks.fields.scores.item-added',
        [ChangesKinds.ITEM_REMOVED]: 'risks.fields.scores.item-removed',
      },
    },
  ],
  notifications: [],
  data({ diffs: { scores }, newDoc }) {
    const { item: { value, scoredAt, scoredBy } } = scores;
    const auditConfig = this;
    const orgId = () => auditConfig.docOrgId(newDoc);

    return {
      value: () => value,
      date: () => getPrettyOrgDate(scoredAt, orgId()),
      userName: () => getUserFullNameOrEmail(scoredBy),
    };
  },
};
