import { Migrations } from 'meteor/percolate:migrations';

import { Risks, NonConformities, Relations } from '../../../share/collections';
import { SystemName, DocumentTypes } from '../../../share/constants';

export const up = async () => {
  const query = {
    standardsIds: { $exists: true },
  };
  const modifier = {
    $unset: {
      standardsIds: '',
    },
  };
  const options = { multi: true, validate: false };

  const insertRelations = documentType => async ({ _id, standardsIds = [] }) =>
    Promise.all(standardsIds.map(documentId => Relations.insert({
      rel1: {
        documentId: _id,
        documentType,
      },
      rel2: {
        documentId,
        documentType: DocumentTypes.STANDARD,
      },
      createdBy: SystemName,
    })));

  const riskPromises = await Risks.find(query).map(insertRelations(DocumentTypes.RISK));
  const nonconformityPromises = await NonConformities.find(query)
    .map(insertRelations(DocumentTypes.NON_CONFORMITY));

  await riskPromises;
  await nonconformityPromises;

  Risks.update(query, modifier, options);
  NonConformities.update(query, modifier, options);
};

export const down = async () => {
  const query = {
    $or: [
      {
        'rel1.documentType': DocumentTypes.STANDARD,
        'rel2.documentType': DocumentTypes.RISK,
      },
      {
        'rel1.documentType': DocumentTypes.RISK,
        'rel2.documentType': DocumentTypes.STANDARD,
      },
      {
        'rel1.documentType': DocumentTypes.STANDARD,
        'rel2.documentType': DocumentTypes.NON_CONFORMITY,
      },
      {
        'rel1.documentType': DocumentTypes.NON_CONFORMITY,
        'rel2.documentType': DocumentTypes.STANDARD,
      },
    ],
  };

  const promises = await Relations.find(query).map(async ({ rel1, rel2 }) => {
    const rel = rel1.documentType === DocumentTypes.STANDARD ? rel2 : rel1;
    const standardId = rel1.documentType === DocumentTypes.STANDARD ?
      rel1.documentId : rel2.documentId;
    const modifier = {
      $addToSet: {
        standardsIds: standardId,
      },
    };
    if (rel.documentType === DocumentTypes.RISK) {
      return Risks.update({ _id: rel.documentId }, modifier, { validate: false });
    }
    return NonConformities.update({ _id: rel.documentId }, modifier, { validate: false });
  });

  await promises;

  return Relations.remove(query);
};

Migrations.add({
  up,
  down,
  version: 20,
  name: 'Moves standard relations to Relations collection',
});
