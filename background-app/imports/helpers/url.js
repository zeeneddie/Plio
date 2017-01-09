import { Meteor } from 'meteor/meteor';

import { Organizations } from '/imports/share/collections/organizations';
import { ProblemTypes } from '/imports/share/constants';


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

export const getActionUrl = (serialNumber, documentId) => (
  getDocUrl({
    prefix: 'actions',
    serialNumber,
    documentId,
  })
);

export const getNCUrl = (serialNumber, documentId) => (
  getDocUrl({
    prefix: 'non-conformities',
    serialNumber,
    documentId,
  })
);

export const getRiskUrl = (serialNumber, documentId) => (
  getDocUrl({
    prefix: 'risks',
    serialNumber,
    documentId,
  })
);

export const getStandardUrl = (serialNumber, documentId) => (
  getDocUrl({
    prefix: 'standards',
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
