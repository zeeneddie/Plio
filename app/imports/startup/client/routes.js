import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts';
import '/imports/ui/components';
import '/imports/ui/pages';

import { Organizations } from '/imports/api/organizations/organizations.js';

FlowRouter.route('/', {
  name: 'home',
  action(params) {
    BlazeLayout.render('LoginLayout');
  }
});

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

FlowRouter.route('/hello', {
  name: 'hello',
  action(params) {
    BlazeLayout.render('HelloPage');
  }
});

FlowRouter.route('/:orgSerialNumber/standards', {
  name: 'standards',
  action(params) {
    BlazeLayout.render('StandardsLayout', {
      headerTitle: 'Standards book',
      contentList: 'StandardsList',
      contentCard: 'StandardsCard'
    });
  }
});

FlowRouter.route('/:orgSerialNumber', {
  name: 'dashboardPage',
  triggersEnter: [checkLoggedIn],
  action(params) {
    BlazeLayout.render('DashboardLayout', {
      content: 'DashboardPage'
    });
  }
});

function redirectHandler() {
  const orgSerialNumber = FlowRouter.getQueryParam('org');
  if (orgSerialNumber) {
    FlowRouter.go('dashboardPage', { orgSerialNumber });
  } else {
    FlowRouter.go('hello');
  }
};

function checkLoggedIn(context, redirect) {
  if (!Meteor.loggingIn()) {
    if (!Meteor.user()) {
      redirect('signIn', {}, { org: context.params.orgSerialNumber });
    }
  }
};
