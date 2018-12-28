import { getIds } from 'plio-util';

import { DocumentTypes } from '../../constants';

// Always call this last because other functions may depend on existing relations
export const removeRelations = async (doc, context) => {
  const { collections: { Relations } } = context;
  const query = {
    $or: [
      { 'rel1.documentId': doc._id },
      { 'rel2.documentId': doc._id },
    ],
  };

  return Relations.remove(query);
};

export const removeFiles = async (doc, context) => {
  const { collections: { Files } } = context;
  const { fileIds = [] } = doc;
  const query = { _id: { $in: fileIds } };
  return Files.remove(query);
};

export const removeLessons = async (doc, context) => {
  const { collections: { LessonsLearned } } = context;
  const query = { documentId: doc._id };
  return LessonsLearned.remove(query);
};

export const unlinkActions = async (doc, context) => {
  const { collections: { Actions }, services: { ActionService } } = context;
  const query = { 'linkedTo.documentId': doc._id };
  const options = { fields: { _id: 1 } };
  const actions = await Actions.find(query, options).fetch();
  const ids = getIds(actions);

  return Promise.all(ids.map(_id => ActionService.unlinkDocument({ _id, documentId: doc._id })));
};

export const removeMilestones = async (doc, context) => {
  const { collections: { Relations, Milestones } } = context;
  const query = {
    $or: [
      {
        'rel1.documentId': doc._id,
        'rel2.documentType': DocumentTypes.MILESTONE,
      },
      {
        'rel1.documentType': DocumentTypes.MILESTONE,
        'rel2.documentId': doc._id,
      },
    ],
  };
  const cursor = Relations.find(query);
  const ids = await cursor.map(({ rel1, rel2 }) => {
    if (rel1.documentType === DocumentTypes.MILESTONE) {
      return rel1.documentId;
    }
    return rel2.documentId;
  });

  return Milestones.remove({ _id: { $in: ids } });
};

export const cleanupCanvas = async (doc, context) => Promise.all([
  removeFiles(doc, context),
  removeLessons(doc, context),
  removeRelations(doc, context),
]);
