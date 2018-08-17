import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.UserDirectory_Header.viewmodel({
  share: 'window',
  mixin: ['organization', 'mobile'],
});
