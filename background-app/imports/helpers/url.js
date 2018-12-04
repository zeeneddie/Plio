import { Meteor } from 'meteor/meteor';
import invariant from 'invariant';
import { is } from 'ramda';

import { Organizations } from '../share/collections';
import { ProblemTypes, DocumentTypes } from '../share/constants';

export const getPathPrefixByDocType = docType => ({
  [DocumentTypes.STANDARD]: 'standards',
  [DocumentTypes.RISK]: 'risks',
  [DocumentTypes.NON_CONFORMITY]: 'non-conformities',
  [DocumentTypes.POTENTIAL_GAIN]: 'non-conformities',
})[docType];

export const getAbsoluteUrl = path => (
  Meteor.absoluteUrl(path, {
    rootUrl: Meteor.settings.mainApp.url,
  })
);

export const getDocPath = ({ serialNumber, documentId, prefix }) => (
  `${serialNumber}/${prefix}/${documentId}`
);

export const getDocUrl = ({ serialNumber, documentId, prefix }) => (
  getAbsoluteUrl(getDocPath({ serialNumber, documentId, prefix }))
);

export const getNCUrl = (serialNumber, documentId) => (
  getDocUrl({
    prefix: getPathPrefixByDocType(DocumentTypes.NON_CONFORMITY),
    serialNumber,
    documentId,
  })
);

export const getRiskUrl = (serialNumber, documentId) => (
  getDocUrl({
    prefix: getPathPrefixByDocType(DocumentTypes.RISK),
    serialNumber,
    documentId,
  })
);

export const getStandardUrl = (serialNumber, documentId) => (
  getDocUrl({
    prefix: getPathPrefixByDocType(DocumentTypes.STANDARD),
    serialNumber,
    documentId,
  })
);

export const getWorkItemUrl = (serialNumber, documentId) => {
  const path = `${serialNumber}/work-inbox?id=${documentId}`;
  return getAbsoluteUrl(path);
};

export const getProblemUrl = (problem, problemType, organization) => {
  const urlFn = {
    [ProblemTypes.NON_CONFORMITY]: getNCUrl,
    [ProblemTypes.POTENTIAL_GAIN]: getNCUrl,
    [ProblemTypes.RISK]: getRiskUrl,
  }[problemType];

  return urlFn && urlFn(organization.serialNumber, problem._id);
};

export const getDocUrlByOrganizationId = prefix => ({ _id, organizationId }) => {
  const { serialNumber } = { ...Organizations.findOne({ _id: organizationId }) };
  const url = getDocUrl({ serialNumber, prefix, documentId: _id });

  return url;
};

export const getDocUnsubscribePath = path => (path ? `${path}/unsubscribe` : '');

export const getCollectionUrlByDocType = (docType, serialNumber) => {
  const prefix = getPathPrefixByDocType(docType);
  const url = getAbsoluteUrl(`${serialNumber}/${prefix}`);

  return url;
};

export const removeQueryParams = str => `${str}`.split('?')[0];

export const getOrgUrl = (orgIdOrSerialNumber, ...path) => {
  let serialNumber = orgIdOrSerialNumber;

  if (is(String, serialNumber)) {
    const query = { _id: orgIdOrSerialNumber };
    const options = { fields: { serialNumber: 1 } };
    ({ serialNumber } = Organizations.findOne(query, options));
  }

  if (process.env.NODE_ENV !== 'production') {
    invariant(serialNumber, '[getOrgUrl]: serial number is required');
  }

  return getAbsoluteUrl(serialNumber + path.join(''));
};

export const getGoalUrl = ({ organizationId }) => getOrgUrl(organizationId);
export const getMilestoneUrl = getGoalUrl;

export const getCanvasUrl = organizationId => getOrgUrl(organizationId, '/canvas');
