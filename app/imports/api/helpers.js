import moment from 'moment-timezone';

import { DocumentTypes } from './constants.js';
import { Standards } from './standards/standards.js';
import { NonConformities } from './non-conformities/non-conformities.js';
import { Risks } from './risks/risks.js';

const compareDates = (date1, date2) => {
  if (!_.isDate(date1)) {
    throw new Error(
      'First argument of "compareDates" function must be of type Date'
    );
  }

  if (!_.isDate(date2)) {
    throw new Error(
      'Second argument of "compareDates" function must be of type Date'
    );
  }

  const utcDate1 = new Date(
    date1.getTime() + (date1.getTimezoneOffset() * 60000)
  );

  const utcDate2 = new Date(
    date2.getTime() + (date2.getTimezoneOffset() * 60000)
  );

  if (utcDate1 > utcDate2) {
    return 1;
  } else if (utcDate1 === utcDate2) {
    return 0;
  } else if (utcDate1 < utcDate2) {
    return -1;
  }
};

const getFormattedDate = (date, stringFormat) => {
  return moment(date).format(stringFormat);
};

const getTzTargetDate = (targetDate, timezone) => {
  return moment.tz([
    targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()
  ], timezone).toDate();
};

const handleMethodResult = (cb) => {
  return (err, res) => {
    if (err) {
      toastr.error(err.reason);
    }
    if (_.isFunction(cb)) {
      cb(err, res);
    }
  };
};

const getCollectionByDocType = (docType) => {
  const { STANDARD, NON_CONFORMITY, RISK } = DocumentTypes;
  switch(docType) {
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

const chain = (...fns) => (...args) => fns.map(fn => fn(...args));

const checkAndThrow = (predicate, error = '') => {
  if (predicate) throw error;
};

export {
  compareDates,
  getFormattedDate,
  getTzTargetDate,
  handleMethodResult,
  getCollectionByDocType,
  chain,
  checkAndThrow
};
