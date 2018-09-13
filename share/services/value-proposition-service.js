import { CanvasTypes } from '../constants';

export default {
  insert: async ({
    organizationId,
    title,
    originatorId,
    matchedTo,
    color,
    notes,
  }, { userId, collections: { ValuePropositions } }) => ValuePropositions.insert({
    organizationId,
    title,
    originatorId,
    color,
    notes,
    matchedTo,
    createdBy: userId,
  }),
  async update({
    _id,
    title,
    originatorId,
    color,
    matchedTo,
    notes,
    fileIds,
  }, { userId, collections: { ValuePropositions } }) {
    const query = { _id };
    const modifier = {
      $set: {
        title,
        originatorId,
        color,
        matchedTo,
        notes,
        fileIds,
        updatedBy: userId,
      },
    };

    return ValuePropositions.update(query, modifier);
  },
  async unmatch({ _id }, { collections: { CustomerSegments } }) {
    return CustomerSegments.update(
      {
        matchedTo: {
          documentId: _id,
          documentType: CanvasTypes.VALUE_PROPOSITION,
        },
      },
      { $unset: { matchedTo: '' } },
      { multi: true },
    );
  },
  async delete(args, context) {
    const { _id } = args;
    const { collections: { ValuePropositions } } = context;

    const res = ValuePropositions.remove({ _id });
    await this.unmatch(args, context);

    return res;
  },
};
