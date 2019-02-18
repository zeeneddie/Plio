import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkOrgMembership,
  checkValuePropositionMatchedToAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../../../share/subscriptions/constants';

export const resolver = async (root, args, context) =>
  context.services.ValuePropositionService.insert(args, context);

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkOrgMembership(),
  checkValuePropositionMatchedToAccess(),
  async (next, root, args, context) => {
    const _id = await next(root, args, context);
    const { pubsub, collections: { ValuePropositions } } = context;
    const valueProposition = ValuePropositions.findOne({ _id });

    pubsub.publish(
      Subscriptions.VALUE_PROPOSITION_CHANGED,
      {
        [Subscriptions.VALUE_PROPOSITION_CHANGED]: {
          entity: valueProposition,
          kind: DocChangeKinds.INSERT,
        },
      },
    );

    return { valueProposition };
  },
)(resolver);
