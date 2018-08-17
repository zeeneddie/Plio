import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  flattenInput,
} from '../../../../../share/middleware';

const afterware = () => async (next, root, args, context) => {
  const { collections: { Risks } } = context;
  const _id = await next(root, args, context);
  const risk = Risks.findOne({ _id });
  return { risk };
};

export const resolver = async (root, args, { services: { RiskService } }) =>
  RiskService.insert(args);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  afterware(),
)(resolver);
