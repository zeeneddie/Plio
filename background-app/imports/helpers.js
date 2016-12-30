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

export const generateDocUrl = getUrl => ({ _id, organizationId }) => {
  const organization = Organizations.findOne({ _id: organizationId });
  return Meteor.absoluteUrl(getUrl({ ...organization, organizationId, documentId: _id }), {
    rootUrl: Meteor.settings.mainApp.url,
  });
};

export const generateDocUrlByPrefix = prefix => generateDocUrl(({ serialNumber, documentId }) =>
  `${serialNumber}/${prefix}/${documentId}`);

export const generateDocUnsubscribeUrl = url => (url ? `${url}/unsubscribe` : '');

export const getProblemUrl = (problem, problemType, organization) => {
  const path = {
    [ProblemTypes.NON_CONFORMITY]: 'non-conformities',
    [ProblemTypes.RISK]: 'risks',
  }[problemType];

  return generateDocUrlByPrefix(path)({ _id: problem._id, organizationId: organization._id });
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
