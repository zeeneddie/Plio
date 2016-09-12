import { Template } from 'meteor/templating';

const cutSpacebarsKw = fn => (...args) => _.last(args) instanceof Spacebars.kw
  ? fn(...Array.prototype.slice.call(args, 0, args.length - 1))
  : fn(...args);

Template.registerHelper('callback', function(param, obj) {
  const instance = Template.instance().viewmodel || Template.instance().data;

  if (obj instanceof Spacebars.kw) obj = instance;

  return () => obj[param].bind(instance);
});

Template.registerHelper('not', function(value) {
  return !value;
});

Template.registerHelper('eq', function(val1, val2) {
  return Object.is(val1, val2);
});

Template.registerHelper('every', cutSpacebarsKw(function(...values) {
  return values.every(value => !!value);
}));

Template.registerHelper('some', cutSpacebarsKw(function(...values) {
  return values.some(value => !!value);
}));

Template.registerHelper('pick', cutSpacebarsKw(function(obj, ...keys) {
  return _.pick(obj, ...keys);
}));

Template.registerHelper('omit', cutSpacebarsKw(function(obj, ...keys) {
  return _.omit(obj, ...keys);
}));

Template.registerHelper('log', console.log);
