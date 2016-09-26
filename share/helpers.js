import moment from 'moment-timezone';
import Handlebars from 'handlebars';

import { CollectionNames, DocumentTypes } from './constants.js';
import { Actions } from './collections/actions.js';
import { NonConformities } from './collections/non-conformities.js';
import { Risks } from './collections/risks.js';
import { Standards } from './collections/standards.js';


export const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1);

export const deepExtend = (dest, src) => {
  _(src).each((val, key) => {
    if (_(val).isObject() && _(dest[key]).isObject()) {
      deepExtend(dest[key], val);
    } else {
      dest[key] = val;
    }
  });
};

export const getCollectionByName = (colName) => {
  const collections = {
    [CollectionNames.ACTIONS]: Actions,
    [CollectionNames.NCS]: NonConformities,
    [CollectionNames.RISKS]: Risks,
    [CollectionNames.STANDARDS]: Standards
  };

  return collections[colName];
};

export const getCollectionByDocType = (docType) => {
  const { STANDARD, NON_CONFORMITY, RISK } = DocumentTypes;
  switch (docType) {
    case STANDARD:
      return Standards;
      break;
    case NON_CONFORMITY:
      return NonConformities;
      break;
    case RISK:
      return Risks;
      break;
    default:
      return undefined;
      break;
  }
};

export const getCollectionNameByDocType = (docType) => {
  return {
    [DocumentTypes.STANDARD]: CollectionNames.STANDARDS,
    [DocumentTypes.NON_CONFORMITY]: CollectionNames.NCS,
    [DocumentTypes.RISK]: CollectionNames.RISKS
  }[docType];
};

export const getFormattedDate = (date, stringFormat) => {
  return moment(date).format(stringFormat);
};

export const getLinkedDoc = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  return collection.findOne({ _id: documentId });
};

export const renderTemplate = (template, data = {}) => {
  const compiledTemplate = Handlebars.compile(template);
  return compiledTemplate(data);
};
