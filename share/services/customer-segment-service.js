import { CanvasTypes } from '../constants';

export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    matchedTo,
    percentOfMarketSize,
    color,
    notes,
  }, { userId, collections: { CustomerSegments } }) => CustomerSegments.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    percentOfMarketSize,
    matchedTo,
    createdBy: userId,
  }),
  async update({
    _id,
    title,
    originatorId,
    color,
    matchedTo,
    percentOfMarketSize,
    notes,
  }, { userId, collections: { CustomerSegments } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        matchedTo,
        percentOfMarketSize,
        notes,
        updatedBy: userId,
      },
    };

    return CustomerSegments.update(query, modifier);
  },
  async unmatch({ _id }, { collections: { ValuePropositions } }) {
    return ValuePropositions.update(
      {
        matchedTo: {
          documentId: _id,
          documentType: CanvasTypes.CUSTOMER_SEGMENT,
        },
      },
      { $unset: { matchedTo: '' } },
      { multi: true },
    );
  },
  async delete(args, context) {
    const { _id } = args;
    const { collections: { CustomerSegments } } = context;

    const res = CustomerSegments.remove({ _id });
    await this.unmatch(args, context);

    return res;
  },
};
