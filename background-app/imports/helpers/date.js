import moment from 'moment-timezone';
import pluralize from 'pluralize';

import { Organizations } from '../share/collections';
import { DefaultDateFormat } from '../share/constants';

export const getPrettyTzDate = (date, timezone = 'UTC', format = DefaultDateFormat) => (
  moment(date).tz(timezone).format(format)
);

export const getPrettyOrgDate = (date, organizationId, format = DefaultDateFormat) => {
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

// Determines whether or not date is in interval startDate < targetDate < endDate
// with the step of interval
export const isDateScheduled = (dateConfig, targetDate, timezone, date) => {
  const { start, interval, until } = dateConfig;

  const startDate = moment(targetDate)
    .subtract(start.timeValue, start.timeUnit)
    .tz(timezone)
    .startOf('day')
    .toDate();

  const endDate = moment(targetDate)
    .add(until.timeValue, until.timeUnit)
    .tz(timezone)
    .startOf('day')
    .toDate();

  let temp = startDate;

  while (moment(temp).isSameOrBefore(endDate)) {
    if (moment(temp).isSame(date)) {
      return true;
    }

    temp = moment(temp).add(interval.timeValue, interval.timeUnit).toDate();
  }

  return false;
};
