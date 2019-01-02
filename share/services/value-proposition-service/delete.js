import unmatch from './unmatch';
import { cleanupCanvas } from '../util/cleanup';

export default async function deleteValueProposition(args, context) {
  const { _id } = args;
  const query = { 'linkedTo.documentId': _id };
  const { valueProposition, collections: { ValuePropositions, Benefits, Features } } = context;

  const [res] = await Promise.all([
    ValuePropositions.remove({ _id }),
    unmatch(args, context),
    Benefits.remove(query),
    Features.remove(query),
    cleanupCanvas(valueProposition, context),
  ]);

  return res;
}
