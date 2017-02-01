import curry from 'lodash.curry';
import get from 'lodash.get';
import property from 'lodash.property';
import invoke from 'lodash.invoke';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ViewModel } from 'meteor/manuel:viewmodel';
import { shallowEqual, mapProps } from 'recompose';
import { $ } from 'meteor/jquery';

import {
  ActionsListProjection,
  NonConformitiesListProjection,
  RisksListProjection,
} from '/imports/share/constants.js';
import { Actions } from '/imports/share/collections/actions.js';
import { NonConformities } from '/imports/share/collections/non-conformities.js';
import { Risks } from '/imports/share/collections/risks.js';
import { renderTemplate, getTitlePrefix } from '/imports/share/helpers';

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

export const flattenObjects = (collection = []) =>
  collection.reduce((prev, cur) => ({ ...prev, ...cur }), {});

export const extractIds = (collection = []) => collection.map(property('_id'));

export const not = expression => !expression;

export const mapByIndex = (obj = {}, index = 0, arr = []) =>
  Object.assign([], arr, { [index]: { ...arr[index], ...obj } });

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

export const $isScrolledToBottom = (div) =>
  div.scrollTop() + div.innerHeight() >= div.prop('scrollHeight');

export const $isAlmostScrolledToBottom = (div) =>
  div.scrollTop() + div.innerHeight() + 100 >= div.prop('scrollHeight');

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

export const propSections = property('sections');

export const lengthSections = compose(length, propSections);

export const propTypes = property('types');

export const lengthTypes = compose(length, propTypes);

export const propIsDeleted = property('isDeleted');

export const notDeleted = compose(not, propIsDeleted);

export const flattenMapItems = flattenMap(propItems);

export const flattenMapStandards = flattenMap(propStandards);

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
});

export const pickC = curry((keys, obj) => _.pick(Object.assign({}, obj), ...keys));

// pickDeep(['a.b.c'])({ a: { b: { c: 123 }}}) => { c: 123 }
export const pickDeep = curry((paths, obj) =>
  flattenObjects(paths.map(path =>
    ({ [path.replace(/.*\./g, '')]: get(obj, path) }))));

export const pickFrom = curry((prop, props) => compose(pickC(props), property(prop)));

export const pickFromDiscussion = pickFrom('discussion');

export const pickFromStandards = pickFrom('standards');

export const pickFromCollections = pickFrom('collections');

export const omitC = curry((keys, obj) => _.omit(obj, ...keys));

export const getC = curry((path, obj) => get(obj, path));

export const getId = getC('_id');

export const equals = curry((val1, val2) => _.isEqual(val1, val2));

export const notEquals = compose(not, equals);

export const propEq = curry((path, assumption, obj) => equals(get(obj, path), assumption));

export const propEqId = propEq('_id');

export const findIndexById = curry((_id, array) => array.findIndex(propEqId(_id)));

export const T = () => true;

export const F = () => false;

export const find = curry((transformation, array) => Object.assign([], array).find(transformation));

export const propId = property('_id');

export const every = curry((fns, value) => fns.every(fn => fn(value)));

export const some = curry((fns, value) => fns.some(fn => fn(value)));

export const hasC = curry((key, obj) => _.has(Object.assign({}, obj), key));

export const shallowCompare = compose(not, shallowEqual);

export const mapToProps = curry((props, array) => [...array].map(pickC([...props])));

export const compareByProps = curry((props, a, b) =>
  notEquals(mapToProps(props, a), mapToProps(props, b)));

/**
 * Picks properties of the passed object from the next object and compares them
 * Example: compareProps({ a: 1, b: 2 })({ c: 1, a: 1, b: 2 }) => true
 */

export const compareProps = obj => compose(equals(obj), pickC(Object.keys(obj)));

export const includes = curry((value, array) => Object.assign([], array).includes(value));

export const identity = _.identity;

/*
  compose(
    join(' '),
    chain(getFirstName, getLastName)
  )(user);
  => 'FirstName LastName';
*/
export const join = curry((separator, array) => Object.assign([], array).join(separator));

/*
  const gt10 = n => n > 10;
  either(gt10, identity)(2);
  => 2;
*/
export const either = (...fns) => (...args) => {
  let result;
  for (let i = 0; i < fns.length; i++) {
    result = fns[i](...args);
    if (!result) continue;
    else break;
  }
  return result;
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
export const sortArrayByTitlePrefix = (arr) => [...arr].sort((a, b) => {
  const at = getTitlePrefix(`${a.titlePrefix}`.toLowerCase());
  const bt = getTitlePrefix(`${b.titlePrefix}`.toLowerCase());

  if (typeof at === 'number' && typeof bt !== 'number') {
    return -1;
  }
  if (typeof bt === 'number' && typeof at !== 'number') {
    return 1;
  }
  if (at < bt) {
    return -1;
  }
  if (at > bt) {
    return 1;
  }
  return at === bt ? 0 : -1;
});

export const getNewerDate = (...dates) => new Date(Math.max(...dates.map((date = null) => date)));

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

  return results.explain(verbose).then(res =>
    console.log(JSON.stringify(res, null, 2).substr(0, 5000)));
};

export const makeQueryNonDeleted = query => ({ ...query, isDeleted: { $in: [null, false] } });
export const makeOptionsFields = fields => (fields ? ({ fields }) : ({}));
export const getCursorNonDeleted = curry((query, fields, collection) =>
  collection.find(makeQueryNonDeleted(query), makeOptionsFields(fields)));

export const toObjFind = value => ({ find: value });

// You can add here more if you need
export const getRequiredFieldsByCollection = (collection) => {
  switch (collection) {
    case Actions:
      return ActionsListProjection;
    case NonConformities:
      return NonConformitiesListProjection;
    case Risks:
      return RisksListProjection;
    default:
      return {};
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

export const diff = (o1, o2) => {
  const result = { ...o1 };
  for (const [key, value] of Object.entries(o2)) {
    if (equals(result[key], value)) {
      delete result[key];
    } else if (!result.hasOwnProperty(key)) {
      result[key] = value;
    }
  }
  return result;
};

export const testPerformance = (func) => (...args) => {
  const type = typeof func;

  if (type !== 'function') throw new Error(`Expected function, got ${type}`);

  const p1 = performance.now();

  const result = func(...args);

  const p2 = performance.now();

  console.log(`Execution time of "${func.name}":`, p2 - p1);

  return result;
};

export const getProblemStatusColor = (status) => {
  switch (status) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 6:
    case 7:
    case 8:
    case 9:
    case 11:
    case 12:
    case 13:
    case 15:
    case 16:
      return 'amber';
    case 5:
    case 10:
    case 14:
    case 17:
    case 18:
      return 'red';
    case 19:
    case 20:
      return 'green';
    default:
      return '';
  }
};

export const getSortedItems = (items, compareFn) =>
  Array.from(items || []).sort(compareFn);

export const compareRisksByScore = (risk1, risk2) => {
  const score1 = risk1.getScore();
  const score2 = risk2.getScore();
  const { value: scoreVal1 } = score1 || {};
  const { value: scoreVal2 } = score2 || {};

  if ((score1 && score2) && (scoreVal1 !== scoreVal2)) {
    return scoreVal2 - scoreVal1;
  } else if (score1 && !score2) {
    return -1;
  } else if (!score1 && score2) {
    return 1;
  }

  return risk1.serialNumber - risk2.serialNumber;
};

export const compareStatusesByPriority = (() => {
  const getPriority = (status) => {
    const priorities = {
      red: 3,
      amber: 2,
      green: 1,
    };

    return priorities[getProblemStatusColor(status)] || 0;
  };

  return (status1, status2) => {
    const priority1 = getPriority(status1);
    const priority2 = getPriority(status2);

    if (priority1 !== priority2) {
      return priority2 - priority1;
    }

    return status2 - status1;
  };
})();

export const getSelectedOrgSerialNumber = () => (
  localStorage.getItem(`${Meteor.userId()}: selectedOrganizationSerialNumber`)
);

export const getUserJoinedAt = (organization = {}, userId) => {
  const currentUserInOrg = [...organization.users].find(propEq('userId', userId));
  const joinedAt = getC('joinedAt', currentUserInOrg);

  return joinedAt;
};

export const looksLikeAPromise = obj => !!(
  obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
);

/*
  Example:
  compileTemplateObject({
    title: 'Hello {{title}}',
    type: 'some {{type}}',
  }, {
    title: 'World',
    type: 'cool stuff',
  });
  -> { title: 'Hello World', type: 'some cool stuff' };
*/
export const compileTemplateObject = (params, paramMap) => {
  const regexString = Object.keys(paramMap).reduce((prev, cur) => `${prev}|{{${paramMap[cur]}}}`);
  const regex = new RegExp(regexString, 'g');

  return Object.keys(params).reduce((prev, key) => {
    let value = params[key];

    if (typeof value === 'string' && value.search(regex)) {
      value = renderTemplate(value, paramMap);
    }

    return { ...prev, [key]: value };
  }, {});
};

export const createSearchRegex = (val, isPrecise) => {
  let r;
  let value = `${val}`;

  try {
    if (isPrecise) {
      value = value.replace(/"/g, '');
      r = new RegExp(`.*(${value}).*`, 'i');
    } else {
      r = value.split(' ')
          .filter(word => !!word)
          .map(word => `(?=.*\\b.*${word}.*\\b)`)
          .join('');

      r = new RegExp(`^${r}.*$`, 'i');
    }
  } catch (err) { /* ignore errors */ }

  return r;
};

/*
  Example:
  searchByRegex(
    ['name', 'sequentialId'],
    createSearchRegex('Hello World'),
    [{ name: '123' }, { name: 'Hello World' }]
  );
  => [{ name: 'Hello World' }];
*/
export const searchByRegex = curry((regex, transformOrArrayOfProps, array) =>
  array.filter((item) => {
    if (typeof transformOrArrayOfProps === 'function') {
      const result = transformOrArrayOfProps(item);
      return result.filter(a => typeof a === 'string' && a.search(regex) >= 0).length;
    }

    if (!_.isArray(transformOrArrayOfProps)) return false;

    return transformOrArrayOfProps.filter(prop =>
      typeof item[prop] === 'string' && item[prop].search(regex) >= 0).length;
  }));

export const omitProps = compose(mapProps, omitC);
