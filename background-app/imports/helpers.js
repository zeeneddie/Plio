import moment from 'moment-timezone';
import pluralize from 'pluralize';
import { Meteor } from 'meteor/meteor';

import { Organizations } from '/imports/share/collections/organizations';
import { ProblemTypes } from '/imports/share/constants';

export const getProblemName = problem => `${problem.sequentialId} "${problem.title}"`;

export const getProblemDescription = (problemType) => ({
  [ProblemTypes.NON_CONFORMITY]: 'non-conformity',
  [ProblemTypes.RISK]: 'risk',
}[problemType]);

export const getDocPath = ({ serialNumber, documentId, prefix }) =>
  `${serialNumber}/${prefix}/${documentId}`;


export const getAbsoluteUrl = path => Meteor.absoluteUrl(path, {
  rootUrl: Meteor.settings.mainApp.url,
});

export const getDocUrl = ({ serialNumber, documentId, prefix }) =>
  getAbsoluteUrl(getDocPath({ serialNumber, documentId, prefix }));

export const getDocUrlByOrganizationId = prefix => ({ _id, organizationId }) => {
  const { serialNumber } = { ...Organizations.findOne({ _id: organizationId }) };
  const url = getDocUrl({ serialNumber, prefix, documentId: _id });

  return url;
};

export const getDocUnsubscribePath = path => (path ? `${path}/unsubscribe` : '');

export const getProblemUrl = (problem, problemType, organization) => {
  const path = {
    [ProblemTypes.NON_CONFORMITY]: 'non-conformities',
    [ProblemTypes.RISK]: 'risks',
  }[problemType];

  const url = getDocUrl({
    serialNumber: organization.serialNumber,
    documentId: problem._id,
    prefix: path,
  });

  return url;
};

export const getDiffInDays = (targetDate, timezone) => {
  const today = moment()
                  .tz(timezone)
                  .startOf('day')
                  .toDate();
  const diff = moment(targetDate).diff(today);
  const days = Math.floor(Math.abs(moment.duration(diff).asDays()));

  return `${days} ${pluralize('day', days)}`;
};
