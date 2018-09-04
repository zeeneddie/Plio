import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkKeyPartnerAccess,
  keyPartnerUpdateAfterware,
} from '../../../../../share/middleware';

export const resolver = async (root, args, context) =>
  context.services.KeyPartnerService.update(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkKeyPartnerAccess(),
  keyPartnerUpdateAfterware(),
)(resolver);
