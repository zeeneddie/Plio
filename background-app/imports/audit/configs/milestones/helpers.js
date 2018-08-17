import GoalAuditConfig from '../goals/goal-audit-config';
import { Goals } from '../../../share/collections';

export { getNotifyReceivers as getReceivers } from '../../utils/helpers';

export const getLinkedDocNotificationData = ({ _id } = {}) => {
  const goal = Goals.findOne({ milestoneIds: _id });

  return {
    linkedDocDesc: GoalAuditConfig.docDescription(goal),
    linkedDocName: GoalAuditConfig.docName(goal),
  };
};
