import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.UserDirectoryHeader.viewmodel({
  share: 'window',
  mixin: ['organization', 'mobile']
});
