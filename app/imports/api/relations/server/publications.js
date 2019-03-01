import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import { Relations } from '../../../share/collections/relations';

Meteor.publish('relations', ({ rel1, rel2 }) => {
  check(rel1, {
    documentId: Match.Maybe(String),
    documentType: Match.Maybe(String),
  });
  check(rel2, {
    documentId: Match.Maybe(String),
    documentType: Match.Maybe(String),
  });

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

  return Relations.find({ $or: queries });
});
