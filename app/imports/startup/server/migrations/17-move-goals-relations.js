import { Migrations } from 'meteor/percolate:migrations';

import { Goals, Relations } from '../../../share/collections';
import { SystemName, DocumentTypes } from '../../../share/constants';

export const up = async () => {
  const query = {
    milestoneIds: { $exists: true },
    riskIds: { $exists: true },
  };
  const modifier = {
    $unset: {
      milestoneIds: '',
      riskIds: '',
    },
  };
  const options = { multi: true, validate: false };

  const promises = await Goals.find(query).map(async ({ _id, milestoneIds = [], riskIds = [] }) => {
    const insertRelation = documentType => documentId => Relations.insert({
      rel1: {
        documentId: _id,
        documentType: DocumentTypes.GOAL,
      },
      rel2: {
        documentId,
        documentType,
      },
      createdBy: SystemName,
    });
    return Promise.all([
      ...milestoneIds.map(insertRelation(DocumentTypes.MILESTONE)),
      ...riskIds.map(insertRelation(DocumentTypes.RISK)),
    ]);
  });

  await promises;

  return Goals.update(query, modifier, options);
};

export const down = async () => {
  const query = {
    $or: [
      {
        'rel1.documentType': DocumentTypes.GOAL,
        'rel2.documentType': DocumentTypes.MILESTONE,
      },
      {
        'rel1.documentType': DocumentTypes.MILESTONE,
        'rel2.documentType': DocumentTypes.GOAL,
      },
      {
        'rel1.documentType': DocumentTypes.GOAL,
        'rel2.documentType': DocumentTypes.RISK,
      },
      {
        'rel1.documentType': DocumentTypes.RISK,
        'rel2.documentType': DocumentTypes.GOAL,
      },
    ],
  };

  const promises = await Relations.find(query).map(async ({ rel1, rel2 }) => {
    const rel = rel1.documentType === DocumentTypes.GOAL ? rel2 : rel1;
    const goalId = rel1.documentType === DocumentTypes.GOAL ? rel1.documentId : rel2.documentId;
    const modifier = {
      $addToSet: {
        [rel.documentType === DocumentTypes.MILESTONE ? 'milestoneIds' : 'riskIds']: rel.documentId,
      },
    };
    return Goals.update({ _id: goalId }, modifier, { validate: false });
  });

  await promises;

  return Relations.remove(query);
};

Migrations.add({
  up,
  down,
  version: 17,
  name: 'Moves goal relations to Relations collection',
});
