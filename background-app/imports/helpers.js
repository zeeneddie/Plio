import moment from 'moment-timezone';
import pluralize from 'pluralize';

import { ProblemTypes } from '/imports/share/constants';


export const getProblemName = problem => `${problem.sequentialId} "${problem.title}"`;

export const getProblemDescription = (problemType) => {
  return {
    [ProblemTypes.NON_CONFORMITY]: 'non-conformity',
    [ProblemTypes.RISK]: 'risk',
  }[problemType];
};

export const getProblemUrl = (problem, problemType, organization) => {
  const path = {
    [ProblemTypes.NON_CONFORMITY]: 'non-conformities',
    [ProblemTypes.RISK]: 'risks',
  }[problemType];

  return `${organization.serialNumber}/${path}/${problem._id}`;
};

export const getDiffInDays = (targetDate, timezone) => {
  const today = moment().tz(timezone).startOf('day').toDate();
  const diff = moment(targetDate).diff(today);
  const days = Math.floor(Math.abs(moment.duration(diff).asDays()));

  return `${days} ${pluralize('day', days)}`;
};
