import moment from 'moment-timezone';
import curry from 'lodash.curry';
import get from 'lodash.get';
import property from 'lodash.property';
import invoke from 'lodash.invoke';
import Handlebars from 'handlebars';

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import {
  AvatarPlaceholders,
  CollectionNames,
  DocumentTypes,
  ProblemMagnitudes
} from '/imports/share/constants.js';
import { getCollectionByDocType } from '/imports/share/helpers.js';
import { Actions } from '/imports/share/collections/actions.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { Standards } from '/imports/share/collections/standards.js';
import { Organizations } from '/imports/share/collections/organizations.js';

const { compose } = _;


export const setModalError = error => invoke(ViewModel.findOne('ModalWindow'), 'setError', error);

export const chain = (...fns) => (...args) => fns.map(fn => fn(...args));

export const chainCheckers = (...fns) => args => doc => fns.map(fn => fn(args, doc));

export const inject = anything => fn => fn(anything);

export const injectCurry = (anything, fn) => compose(inject(anything), curry)(fn);

export const withUserId = fn => userId => fn({ userId });

export const mapArgsTo = (fn, mapper) => (...args) => fn(mapper(...args));

export const checkAndThrow = (predicate, error = '') => {
  if (predicate) throw error;

  return true;
};

export const flattenObjects = (collection = []) => collection.reduce((prev, cur) => ({ ...prev, ...cur }), {});

export const extractIds = (collection = []) => collection.map(property('_id'));

export const not = expression => !expression;

export const mapByIndex = (value = {}, index = 0, arr = []) =>
  Object.assign([], arr, { [index]: { ...arr[index], ...value } });

export const mapValues = curry((mapper, obj) =>
  flattenObjects(Object.keys(obj).map(key => ({ [key]: mapper(obj[key], key, obj) }))));

export const inspire = curry((props, instance, ...args) =>
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

export const invokeId = instance => invoke(instance, '_id');

export const $isScrolledToBottom = (div = $()) => div.scrollTop() + div.innerHeight() >= div.prop('scrollHeight');

export const $scrollToBottom = (div = $()) => div.scrollTop(div.prop('scrollHeight'));

export const $isScrolledElementVisible = (el, container) => {
  const containerTop = $(container).offset().top;
  const containerBottom = containerTop + $(container).height();
  const elPosition = $(el).position();
  const elemTop = elPosition && elPosition.top;
  const elemBottom = elPosition && elemTop + $(el).height();
  return ((elemBottom < containerBottom) && (elemTop > containerTop));
};

export const getRandomAvatarUrl = () => {
  const randomAvatarIndex = Math.floor(Math.random() * 16);
  return AvatarPlaceholders[randomAvatarIndex];
};

export const getTzTargetDate = (targetDate, timezone) => {
  return targetDate && moment.tz([
    targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()
  ], timezone).toDate();
};

export const getWorkflowDefaultStepDate = ({ organization, linkedTo }) => {
  let magnitude = ProblemMagnitudes.MINOR;

  // Select the highest magnitude among all linked documents
  _.each(linkedTo, ({ documentId, documentType }) => {
    const collection = getCollectionByDocType(documentType);
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
  const date = moment()
      .tz(organization.timezone)
      .startOf('day')
      .add(timeValue, timeUnit)
      .toDate();

  return date;
};

export const generateUserInitials = (userProfile) => {
  const { firstName, lastName} = userProfile;
  let initials = '';
  if (firstName) {
    initials += firstName.charAt(0);
  }

  if (lastName) {
    initials += lastName.charAt(0);
  }

  return initials.toUpperCase();
};

export const generateSerialNumber = (collection, query = {}, defaultNumber = 1) => {
  check(defaultNumber, Number);

  const last = collection.findOne({
    ...query,
    serialNumber: {
      $type: 16 // 32-bit integer
    }
  }, {
    sort: {
      serialNumber: -1
    }
  });

  return last ? last.serialNumber + 1 : defaultNumber;
};

export const handleMethodResult = (cb) => {
  return (err, res) => {
    if (err) {
      toastr.error(err.reason);
    }
    if (_.isFunction(cb)) {
      cb(err, res);
    }
  };
};

export const showError = (errorMsg) => {
  toastr.error(errorMsg);
};
