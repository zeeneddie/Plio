import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
  checkMilestoneLinkedDocument,
  checkMilestoneCompletionTargetDate,
} from '../../../../../share/middleware';

export const resolver = async (root, args, { services: { MilestoneService } }) =>
  MilestoneService.insert(args);

export default applyMiddleware(
  flattenInput(),
  checkLoggedIn(),
  checkOrgMembership(),
  checkMilestoneLinkedDocument(),
  checkMilestoneCompletionTargetDate(),
)(resolver);
