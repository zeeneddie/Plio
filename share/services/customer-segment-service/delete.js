import unmatch from './unmatch';
import { cleanupCanvas } from '../util/cleanup';

export default async function deleteCustomerSegment(args, context) {
  const { _id } = args;
  const { customerSegment, collections: { CustomerSegments, Needs, Wants } } = context;

  const [res] = await Promise.all([
    CustomerSegments.remove({ _id }),
    unmatch(args, context),
    Needs.remove({ 'linkedTo.documentId': _id }),
    Wants.remove({ 'linkedTo.documentId': _id }),
    cleanupCanvas(customerSegment, context),
  ]);

  return res;
}
