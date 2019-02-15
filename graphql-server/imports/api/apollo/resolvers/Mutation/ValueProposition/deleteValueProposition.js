import { applyMiddleware } from 'plio-util';
import {
  checkLoggedIn,
  flattenInput,
  checkValuePropositionAccess,
} from '../../../../../share/middleware';
import { Subscriptions, DocChangeKinds } from '../../../../../share/subscriptions/constants';

export const resolver = async (valueProposition, args, context) =>
  context.services.ValuePropositionService.delete(args, { ...context, valueProposition });

export default applyMiddleware(
  checkLoggedIn(),
  flattenInput(),
  checkValuePropositionAccess(),
  async (next, valueProposition, args, context) => {
    await next(valueProposition, args, context);

    const { pubsub } = context;

    pubsub.publish(
      Subscriptions.VALUE_PROPOSITION_CHANGED,
      {
        [Subscriptions.VALUE_PROPOSITION_CHANGED]: {
          entity: valueProposition,
          kind: DocChangeKinds.DELETE,
        },
      },
    );

    return valueProposition;
  },
)(resolver);
