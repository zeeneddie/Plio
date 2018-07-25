import { Template } from 'meteor/templating';
import { Spacebars } from 'meteor/spacebars';
import { _ } from 'meteor/underscore';
import { capitalize } from '/imports/share/helpers';

const cutSpacebarsKw = fn => (...args) => {
  if (_.last(args) instanceof Spacebars.kw) {
    return fn(...Array.prototype.slice.call(args, 0, args.length - 1));
  }

  return fn(...args);
};

Template.registerHelper('callback', (param, obj) => {
  const instance = Template.instance().viewmodel || Template.instance().data;
  const view = obj instanceof Spacebars.kw ? instance : obj;

  return () => view[param].bind(instance);
});

const helpers = {
  capitalize,
  log: console.log,
  not: val => !val,
  eq: (val1, val2) => Object.is(val1, val2),
  or: (...values) => values.reduce((prev, cur) => prev || cur),
  every: (...values) => values.every(value => !!value),
  some: (...values) => values.some(value => !!value),
  pick: (obj, ...keys) => _.pick(obj, ...keys),
  omit: (obj, ...keys) => _.omit(obj, keys),
  gt: (val1, val2) => val1 > val2,
  lt: (val1, val2) => val1 < val2,
  get: (obj, key) => obj[key],
};

Object.keys(helpers).forEach(key => Template.registerHelper(key, cutSpacebarsKw(helpers[key])));
