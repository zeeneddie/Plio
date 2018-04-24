import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  checkMilestoneLinkedDocument,
  checkMilestoneCompletionTargetDate,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { userId, services: { MilestoneService } }) =>
  MilestoneService.insert({ ...args, createdBy: userId });

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
  checkMilestoneLinkedDocument(),
  checkMilestoneCompletionTargetDate(),
)(resolver);
