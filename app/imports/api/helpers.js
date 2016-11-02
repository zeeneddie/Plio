import moment from 'moment-timezone';
import curry from 'lodash.curry';
import get from 'lodash.get';
import property from 'lodash.property';
import invoke from 'lodash.invoke';
import Handlebars from 'handlebars';
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import {
  AvatarPlaceholders,
  CollectionNames,
  DocumentTypes,
  ProblemMagnitudes,
  ActionsListProjection,
  NonConformitiesListProjection,
  RisksListProjection
} from '/imports/share/constants.js';
import { getCollectionByDocType } from '/imports/share/helpers.js';
import { Actions } from '/imports/share/collections/actions.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { Standards } from '/imports/share/collections/standards.js';
import { Organizations } from '/imports/share/collections/organizations.js';
import { getUserOrganizations } from './organizations/utils';
import { isOrgMemberBySelector } from './checkers';

export const { compose } = _;

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

export const $isScrolledToBottom = (div) => div.scrollTop() + div.innerHeight() >= div.prop('scrollHeight');

export const $isAlmostScrolledToBottom = (div) => div.scrollTop() + div.innerHeight() + 100 >= div.prop('scrollHeight');

export const $scrollToBottom = (div = $()) => div.scrollTop(div.prop('scrollHeight'));

export const $isScrolledElementVisible = (el, container) => {
  const containerTop = $(container).offset().top;
  const containerBottom = containerTop + $(container).height();
  const elPosition = $(el).position();
  const elemTop = elPosition && elPosition.top;
  const elemBottom = elPosition && elemTop + $(el).height();

  return ((elemBottom < containerBottom) && (elemTop >= containerTop));
};

export const flattenMap = curry((mapper, array) => _.flatten(Object.assign([], array).map(mapper)));

export const findById = curry((_id, array) =>
  Object.assign([], array).find((item = {}) => Object.is(item._id, _id)));

export const length = (array = []) => array.length;

export const propItems = property('items');

export const lengthItems = compose(length, propItems);

export const propMessages = property('messages');

export const lengthMessages = compose(length, propMessages);

export const propStandards = property('standards');

export const lengthStandards = compose(length, propStandards);

export const flattenMapItems = flattenMap(propItems);

export const assoc = curry((prop, val, obj) => Object.assign({}, obj, { [prop]: val }));

export const invokeC = curry((path, obj, ...args) => invoke(obj, path, ...args));

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
export const transsoc = curry((transformations, obj) => {
  const keys = Object.keys(Object.assign({}, transformations));
  const result = keys.map(key => assoc(key, transformations[key](obj), obj));

  return _.pick(flattenObjects(result), ...keys);
})

export const pickC = curry((keys, obj) => _.pick(obj, ...keys));

export const pickFrom = curry((prop, props) => compose(pickC(props), property(prop)));

export const pickFromDiscussion = pickFrom('discussion');

export const pickFromStandards = pickFrom('standards');

export const omitC = curry((keys, obj) => _.omit(obj, ...keys));

export const getC = curry((path, obj) => get(obj, path));

export const equals = curry((val1, val2) => _.isEqual(val1, val2));

export const propEq = curry((path, assumption, obj) => equals(get(obj, path), assumption));

export const T = () => true;

export const F = () => false;

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

export const getNewerDate = (...dates) => new Date(Math.max(...dates.map((date = null) => date)));

export const getPublishCompositeOrganizationUsersObject = (userId, selector) => ({
  find() {
    return getUserOrganizations(userId, selector);
  },
  children: [
    {
      find({ users = [] }) {
        const userIds = users.map(property('userId'));
        const query = { _id: { $in: userIds } };
        const options = { profile: 1 };

        return Meteor.users.find(query, options);
      }
    }
  ]
});

export const getPublishCompositeOrganizationUsers = (fn) => {
  return function(serialNumber, isDeleted = { $in: [null, false] }) {
    check(serialNumber, Number);
    check(isDeleted, Match.OneOf(Boolean, {
      $in: Array
    }));

    const userId = this.userId;

    if (!userId || !isOrgMemberBySelector(userId, { serialNumber })) {
      return this.ready();
    }

    const pubObj = getPublishCompositeOrganizationUsersObject(userId, { serialNumber });

    return Object.assign({}, pubObj, {
      children: [
        ...pubObj.children,
        ...(() => _.isFunction(fn) && fn.call(this, userId, serialNumber, isDeleted))()
      ]
    });
  }
};

export const explainMongoQuery = (
  collection,
  query = {},
  options = {},
  verbose = 'queryPlanner'
) => {
  let results = collection.rawCollection().find(query, _.omit(options, 'sort', 'limit'));

  if (options.sort) {
    results = results.sort(options.sort);
  }

  if (options.limit) {
    results = results.limit(options.limit);
  }

  return results.explain(verbose).then(res => console.log(JSON.stringify(res, null, 2).substr(0, 5000)));
}

export const makeQueryNonDeleted = query => ({ ...query, isDeleted: { $in: [null, false] } });
export const makeOptionsFields = fields => fields ? ({ fields }) : ({});
export const getCursorNonDeleted = curry((query, fields, collection) =>
  collection.find(makeQueryNonDeleted(query), makeOptionsFields(fields)))

export const toObjFind = find => ({ find });

// You can add here more if you need
export const getRequiredFieldsByCollection = (collection) => {
  switch(collection) {
    case Actions:
      return ActionsListProjection;
      break;
    case NonConformities:
      return NonConformitiesListProjection;
      break;
    case Risks:
      return RisksListProjection;
      break;
    default:
      return {};
      break;
  }
};

export const compareDates = (date1, date2) => {
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
