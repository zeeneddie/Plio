import moment from 'moment-timezone';
import pluralize from 'pluralize';

import { Organizations } from '/imports/share/collections/organizations.js';


const DEFAULT_DATE_FORMAT = 'MMMM DD, YYYY';

export const getPrettyTzDate = (date, timezone = 'UTC', format = DEFAULT_DATE_FORMAT) => (
  moment(date).tz(timezone).format(format)
);

export const getPrettyOrgDate = (date, organizationId, format = DEFAULT_DATE_FORMAT) => {
  const { timezone } = Organizations.findOne({ _id: organizationId }) || {};
  return getPrettyTzDate(date, timezone, format);
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
