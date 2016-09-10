import moment from 'moment-timezone';
import curry from 'lodash.curry';
import get from 'lodash.get';
import property from 'lodash.property';

import { Meteor } from 'meteor/meteor';

import { CollectionNames, DocumentTypes } from './constants.js';
import { Actions } from './actions/actions.js';
import { NonConformities } from './non-conformities/non-conformities.js';
import { Risks } from './risks/risks.js';
import { Standards } from './standards/standards.js';
import { Organizations } from './organizations/organizations.js';

const { compose } = _;


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

const getCollectionByName = (colName) => {
  const collections = {
    [CollectionNames.ACTIONS]: Actions,
    [CollectionNames.NCS]: NonConformities,
    [CollectionNames.RISKS]: Risks,
    [CollectionNames.STANDARDS]: Standards
  };

  return collections[colName];
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

export const getCollectionNameByDocType = (docType) => {
  return {
    [DocumentTypes.STANDARD]: CollectionNames.STANDARDS,
    [DocumentTypes.NON_CONFORMITY]: CollectionNames.NCS,
    [DocumentTypes.RISK]: CollectionNames.RISKS
  }[docType];
};

export const getLinkedDoc = (documentId, documentType) => {
  const collection = getCollectionByDocType(documentType);
  return collection.findOne({ _id: documentId });
};

const chain = (...fns) => (...args) => fns.map(fn => fn(...args));

const chainCheckers = (...fns) => args => doc => fns.map(fn => fn(args, doc));

const inject = anything => fn => fn(anything);

const injectCurry = (anything, fn) => compose(inject(anything), curry)(fn);

const withUserId = fn => (userId) => {
  return fn({ userId });
};

const mapArgsTo = (fn, mapper) => (...args) => fn(mapper(...args));

const checkAndThrow = (predicate, error = '') => {
  if (predicate) throw error;

  return true;
};

const flattenObjects = collection => collection.reduce((prev, cur) => ({ ...prev, ...cur }), {});

const deepExtend = (dest, src) => {
  _(src).each((val, key) => {
    if (_(val).isObject() && _(dest[key]).isObject()) {
      deepExtend(dest[key], val);
    } else {
      dest[key] = val;
    }
  });
};

const extractIds = (collection = []) => collection.map(property('_id'));

export {
  compareDates,
  getCollectionByName,
  getFormattedDate,
  getTzTargetDate,
  getUserFullNameOrEmail,
  getPrettyOrgDate,
  handleMethodResult,
  getCollectionByDocType,
  chain,
  chainCheckers,
  checkAndThrow,
  inject,
  injectCurry,
  renderTemplate,
  withUserId,
  mapArgsTo,
  flattenObjects,
  deepExtend,
  extractIds
};
