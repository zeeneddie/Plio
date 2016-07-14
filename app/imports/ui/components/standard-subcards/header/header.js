import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.SS_Header.viewmodel({
  share: 'window',
  mixin: ['organization', 'mobile']
});
