import { pluck, concat } from 'ramda';

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
  async update(args, context) {
    const {
      _id,
      title,
      originatorId,
      color,
      matchedTo,
      percentOfMarketSize,
      notes,
      fileIds,
    } = args;
    const { userId, collections: { CustomerSegments } } = context;
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        matchedTo,
        percentOfMarketSize,
        notes,
        fileIds,
        updatedBy: userId,
      },
    };

    // Remove all relation documents if matched document is changed
    const customerSegment = CustomerSegments.findOne({ _id, matchedTo });

    if (!customerSegment) await this.deleteRelations({ _id }, context);

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
  async deleteRelations(args, context) {
    const { _id } = args;
    const { collections: { Needs, Wants, Relations } } = context;
    const query = { 'linkedTo.documentId': _id };
    const options = { fields: { _id: 1 } };
    const needs = await Needs.find(query, options).fetch();
    const wants = await Wants.find(query, options).fetch();
    const ids = pluck('_id', concat(needs, wants));

    await Relations.remove({
      $or: [
        { 'rel1.documentId': { $in: ids } },
        { 'rel2.documentId': { $in: ids } },
      ],
    });
  },
  async delete(args, context) {
    const { _id } = args;
    const { collections: { CustomerSegments, Needs, Wants } } = context;

    const res = await CustomerSegments.remove({ _id });
    await this.unmatch(args, context);
    await this.deleteRelations(args, context);
    await Needs.remove({ 'linkedTo.documentId': _id });
    await Wants.remove({ 'linkedTo.documentId': _id });

    return res;
  },
};
