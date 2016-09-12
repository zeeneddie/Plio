import { Template } from 'meteor/templating';

Template.registerHelper('callback', function(param, obj) {
  const instance = Template.instance().viewmodel || Template.instance().data;

  if (obj instanceof Spacebars.kw) obj = instance;

  return () => obj[param].bind(instance);
});
