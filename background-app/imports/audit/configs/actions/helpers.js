import { _ } from 'meteor/underscore';
import { without } from 'ramda';

import {
  Standards,
  NonConformities,
  Risks,
  Goals,
} from '../../../share/collections';
import { ProblemTypes, DocumentTypes } from '../../../share/constants';
import { getUserId, getLinkedDocAuditConfig } from '../../utils/helpers';

export { getLinkedDocName, getLinkedDocDescription } from '../../utils/helpers';

export { getLinkedDocAuditConfig };

export const getReceivers = ({ linkedTo, notify }, user) => {
  const getLinkedDocsIds = (linkedDocs, docType) => _.pluck(
    linkedDocs.filter(({ documentType }) => documentType === docType),
    'documentId',
  );

  const usersIds = new Set(notify);
  const standardsIds = new Set();

  const getIds = (collection, problemType) => {
    const query = {
      _id: { $in: getLinkedDocsIds(linkedTo, problemType) },
    };
    const options = {
      fields: {
        standardsIds: 1,
        originatorId: 1,
      },
    };

    collection.find(query, options).forEach((doc) => {
      doc.standardsIds.forEach(id => standardsIds.add(id));
      usersIds.add(doc.originatorId);
    });
  };

  const problemCollections = [
    { collection: NonConformities, type: ProblemTypes.NON_CONFORMITY },
    { collection: NonConformities, type: ProblemTypes.POTENTIAL_GAIN },
    { collection: Risks, type: ProblemTypes.RISK },
  ];

  problemCollections.forEach(({ collection, type }) => getIds(collection, type));

  Standards.find({
    _id: { $in: Array.from(standardsIds) },
  }, { fields: { owner: 1 } }).forEach(({ owner }) => usersIds.add(owner));

  Goals.find({
    _id: {
      $in: getLinkedDocsIds(linkedTo, DocumentTypes.GOAL),
    },
  }, { fields: { ownerId: 1 } }).forEach(({ ownerId }) => usersIds.add(ownerId));

  const receivers = Array.from(usersIds);

  return without(getUserId(user), receivers);
};
