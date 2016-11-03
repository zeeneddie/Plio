import { Template } from 'meteor/templating';
import { capitalize } from '/imports/share/helpers';

const cutSpacebarsKw = fn => (...args) => _.last(args) instanceof Spacebars.kw
  ? fn(...Array.prototype.slice.call(args, 0, args.length - 1))
  : fn(...args);

Template.registerHelper('callback', function(param, obj) {
  const instance = Template.instance().viewmodel || Template.instance().data;

  if (obj instanceof Spacebars.kw) obj = instance;

  return () => obj[param].bind(instance);
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
  lt: (val1, val2) => val1 < val2
};

Object.keys(helpers).forEach(key => Template.registerHelper(key, cutSpacebarsKw(helpers[key])));
