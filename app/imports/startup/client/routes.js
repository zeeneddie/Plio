import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts';
import '/imports/ui/components';
import '/imports/ui/pages';

import { Organizations } from '/imports/api/organizations/organizations.js';


AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signIn',
  path: '/sign-in',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content',
  redirect: redirectHandler
});

AccountsTemplates.configureRoute('signUp', {
  layoutType: 'blaze',
  name: 'signUp',
  path: '/sign-up',
  layoutTemplate: 'LoginLayout',
  layoutRegions: {},
  contentRegion: 'content',
  redirect: redirectHandler
});

FlowRouter.route('/', {
  name: 'home',
  action(params) {
    BlazeLayout.render('LoginLayout');
  }
});

FlowRouter.route('/hello', {
  name: 'hello',
  action(params) {
    BlazeLayout.render('HelloPage');
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

function redirectHandler() {
  FlowRouter.go('hello');
};
