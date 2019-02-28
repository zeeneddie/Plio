export default {
  insert: async ({ rel1, rel2 }, { userId, collections: { Relations } }) => Relations.insert({
    rel1,
    rel2,
    createdBy: userId,
  }),

  delete: async ({ rel1, rel2 }, { collections: { Relations } }) => {
    const queries = [];

    if (rel1.documentId && rel2.documentId) {
      queries.push(
        {
          'rel1.documentId': rel1.documentId,
          'rel2.documentId': rel2.documentId,
        },
        {
          'rel1.documentId': rel2.documentId,
          'rel2.documentId': rel1.documentId,
        },
      );
    } else if (rel1.documentId) {
      queries.push(
        {
          'rel1.documentId': rel1.documentId,
          'rel2.documentType': rel2.documentType,
        },
        {
          'rel2.documentId': rel1.documentId,
          'rel1.documentType': rel2.documentType,
        },
      );
    } else if (rel2.documentId) {
      queries.push(
        {
          'rel1.documentId': rel2.documentId,
          'rel2.documentType': rel1.documentType,
        },
        {
          'rel2.documentId': rel2.documentId,
          'rel1.documentType': rel1.documentType,
        },
      );
    } else {
      queries.push(
        {
          'rel1.documentType': rel1.documentType,
          'rel2.documentType': rel2.documentType,
        },
        {
          'rel2.documentType': rel1.documentType,
          'rel1.documentType': rel2.documentType,
        },
      );
    }

    return Relations.remove({ $or: queries });
  },
};
