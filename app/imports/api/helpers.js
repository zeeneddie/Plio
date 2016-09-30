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

export const flattenMap = curry((mapper, array) => _.flatten(Object.assign([], array).map(mapper)));

export const findById = curry((_id, array) =>
  Object.assign([], array).find((item = {}) => Object.is(item._id, _id)));

export const length = (array = []) => array.length;

export const propItems = property('items');

export const lengthItems = compose(length, propItems);

export const flattenMapItems = flattenMap(propItems);

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

// 1, 1.2, 3, 10.3, a, b, c
export const sortArrayByTitlePrefix = (arr) => {
  return arr.sort(function (a, b) {
    a = a.titlePrefix;
    b = b.titlePrefix;
    if (typeof a === 'number' && typeof b !== 'number') {
      return -1;
    }
    if (typeof b === 'number' && typeof a !== 'number') {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    if (a === b) {
      return 0;
    } else {
      return -1;
    }
  });
};
