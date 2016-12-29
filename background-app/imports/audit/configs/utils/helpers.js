// Had to use another folder because circular dependencies are not supported

import { Meteor } from 'meteor/meteor';

import { Organizations } from '/imports/share/collections/organizations';

export const generateDocUrl = getUrl => ({ _id, organizationId }) => {
  const organization = Organizations.findOne({ _id: organizationId });
  return Meteor.absoluteUrl(getUrl({ ...organization, organizationId, documentId: _id }), {
    rootUrl: Meteor.settings.mainApp.url,
  });
};

export const generateDocUrlByPrefix = prefix => generateDocUrl(({ serialNumber, documentId }) =>
  `${serialNumber}/${prefix}/${documentId}`);

export const generateDocUnsubscribeUrl = url => `${url}/unsubscribe`;
