import { withFilter } from 'graphql-subscriptions';
import { applyMiddleware } from 'plio-util';
import { allPass, isNil } from 'ramda';

import { checkLoggedIn, checkOrgMembership } from '../../../../../share/middleware';

export const filterFn = subscription => allPass([
  (payload, args) => payload[subscription].entity.organizationId === args.organizationId,
  (payload, args) => isNil(args.kind)
    ? true
    : Array.isArray(args.kind) && args.kind.includes(payload[subscription].kind),
]);

export default subscription => withFilter(
  (root, args, { pubsub }) => pubsub.asyncIterator(subscription),
  applyMiddleware(
    checkLoggedIn(),
    checkOrgMembership(),
  )(filterFn(subscription)),
);
