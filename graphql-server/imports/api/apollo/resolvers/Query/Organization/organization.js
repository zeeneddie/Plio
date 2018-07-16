import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  checkOrgMembership,
  checkOrgMembershipBySerialNumber,
} from '../../../../../share/middleware';

export const resolver = (root, args, { organization }) => organization;

export default applyMiddleware(
  checkLoggedIn(),
  async (next, root, args, context) => {
    const { _id, serialNumber } = args;

    if (_id) return checkOrgMembership(() => args._id)(next, root, args, context);

    if (serialNumber) return checkOrgMembershipBySerialNumber()(next, root, args, context);

    throw new Error('Organization id or serial number is required');
  },
)(resolver);
