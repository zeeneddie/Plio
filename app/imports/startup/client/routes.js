import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts';
import '/imports/ui/components';
import '/imports/ui/pages';


AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signIn',
  path: '/sign-in',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content'
});

AccountsTemplates.configureRoute('signUp', {
  layoutType: 'blaze',
  name: 'signUp',
  path: '/sign-up',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content'
});

FlowRouter.route('/', {
  name: 'home',
  action: function(params) {
    BlazeLayout.render('LoginLayout');
  }
});

FlowRouter.route('/:orgSerialNumber', {
  name: 'dashboardPage',
  action(params) {
    BlazeLayout.render('DashboardLayout', {
      content: 'DashboardPage'
    });
  }
});
