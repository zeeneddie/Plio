import moment from 'moment-timezone';
import curry from 'lodash.curry';
import get from 'lodash.get';
import property from 'lodash.property';
import invoke from 'lodash.invoke';

import { Meteor } from 'meteor/meteor';

import { CollectionNames, DocumentTypes } from './constants.js';
import { Actions } from './actions/actions.js';
import { NonConformities } from './non-conformities/non-conformities.js';
import { Risks } from './risks/risks.js';
import { Standards } from './standards/standards.js';
import { Organizations } from './organizations/organizations.js';
import { ProblemMagnitudes } from '/imports/api/constants.js';

const { compose } = _;

const getDocumentCollectionByType = (type) => {
  if (type === DocumentTypes.NON_CONFORMITY) {
    return NonConformities;
  } else if (type === DocumentTypes.RISK) {
    return Risks;
  } else if (type === DocumentTypes.STANDARD) {
    return Standards;
  }

  return false;
};

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
  return targetDate && moment.tz([
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

const setModalError = error => invoke(ViewModel.findOne('ModalWindow'), 'setError', error);

const chain = (...fns) => (...args) => fns.map(fn => fn(...args));

const chainCheckers = (...fns) => args => doc => fns.map(fn => fn(args, doc));

const inject = anything => fn => fn(anything);

const injectCurry = (anything, fn) => compose(inject(anything), curry)(fn);

const withUserId = fn => userId => fn({ userId });

const mapArgsTo = (fn, mapper) => (...args) => fn(mapper(...args));

const checkAndThrow = (predicate, error = '') => {
  if (predicate) throw error;

  return true;
};

const flattenObjects = (collection = []) => collection.reduce((prev, cur) => ({ ...prev, ...cur }), {});

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

const not = expression => !expression;

const mapByIndex = (value = {}, index = 0, arr = []) =>
  Object.assign([], arr, { [index]: { ...arr[index], ...value } });

const mapValues = curry((mapper, obj) =>
  flattenObjects(Object.keys(obj).map(key => ({ [key]: mapper(obj[key], key, obj) }))));

const inspire = curry((props, instance, ...args) =>
  flattenObjects(props.map((key, i) =>
    ({ [key]: invoke(instance, key, ...((arr = []) => arr[i] || [])(args)) }))));

// Especially useful with viewmodel
// Example of usage:
// inspire({
//   hello(a, b) {
//     return `world ${a} ${b}`;
//   },
//   today(a) {
//     return 'is friday ' + a;
//   }
// }, ['hello', 'today'], ['!!', '1'], [' wohoooooo!']);
//
// > { hello: 'world !! 1', today: 'is friday  wohoooooo!' }

const invokeId = instance => invoke(instance, '_id');

const $isScrolledToBottom = (div) => div.scrollTop() + div.innerHeight() >= div.prop('scrollHeight');

const $scrollToBottom = (div = $()) => div.scrollTop(div.prop('scrollHeight'));

const $isScrolledElementVisible = (el, container) => {
  const containerTop = $(container).offset().top;
  const containerBottom = containerTop + $(container).height();
  const elPosition = $(el).position();
  const elemTop = elPosition && elPosition.top;
  const elemBottom = elPosition && elemTop + $(el).height();

  return ((elemBottom < containerBottom) && (elemTop >= containerTop));
}

const flattenMap = curry((mapper, array) => _.flatten(Object.assign([], array).map(mapper)));

const findById = curry((_id, array) =>
  Object.assign([], array).find((item = {}) => Object.is(item._id, _id)));

const length = (array = []) => array.length;

const propItems = property('items');

const lengthItems = compose(length, propItems);

const propMessages = property('messages');

const lengthMessages = compose(length, propMessages);

const flattenMapItems = flattenMap(propItems);

const getWorkflowDefaultStepDate = ({ organization, linkedTo }) => {
  let magnitude = ProblemMagnitudes.MINOR;

  // Select the highest magnitude among all linked documents
  _.each(linkedTo, ({ documentId, documentType }) => {
    const collection = getDocumentCollectionByType(documentType);
    const doc = collection.findOne({ _id: documentId });
    if (magnitude === ProblemMagnitudes.CRITICAL) {
      return;
    }

    if (doc.magnitude === ProblemMagnitudes.MINOR) {
      return;
    }

    magnitude = doc.magnitude;
  });

  const workflowStepTime = organization.workflowStepTime(magnitude);
  const { timeValue, timeUnit } = workflowStepTime;
  const date = moment().add(timeValue, timeUnit).toDate();

  return date;
}

const assoc = curry((prop, val, obj) => Object.assign({}, obj, { [prop]: val }));

const invokeC = curry((path, obj, ...args) => invoke(obj, path, ...args));

// useful with recompose's withProps:
// const transformer = transsoc({
//   'userAvatar': getUserAvatar,
//   'pathToMessage': getMessagePath
// });
// withProps(transformer)(Component);
// > {
//   pathToMessage: '/98/standards/Mc7jjwYJ9gXPkibS8/discussion?at=jBwoZSJ3S4xkzvpdY',
//   userAvatar: 'https://s3-eu-west-1.amazonaws.com/plio/avatar-placeholders/2.png'
// }
// Object<key: path, value: func> -> obj -> obj
const transsoc = curry((transformations, obj) => {
  const keys = Object.keys(Object.assign({}, transformations));
  const result = keys.map(key => assoc(key, transformations[key](obj), obj));

  return _.pick(flattenObjects(result), ...keys);
})

const pickC = curry((keys, obj) => _.pick(obj, ...keys));

const pickFrom = curry((prop, props) => compose(pickC(props), property(prop)));

const pickFromDiscussion = pickFrom('discussion');

export {
  getDocumentCollectionByType,
  compareDates,
  getCollectionByName,
  getFormattedDate,
  getTzTargetDate,
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
  extractIds,
  not,
  mapByIndex,
  mapValues,
  inspire,
  setModalError,
  invokeId,
  $isScrolledToBottom,
  $scrollToBottom,
  $isScrolledElementVisible,
  getWorkflowDefaultStepDate,
  assoc,
  invokeC,
  transsoc,
  pickC,
  flattenMap,
  findById,
  length,
  propItems,
  lengthItems,
  flattenMapItems,
  getWorkflowDefaultStepDate,
  propMessages,
  lengthMessages,
  pickFrom,
  pickFromDiscussion
};
