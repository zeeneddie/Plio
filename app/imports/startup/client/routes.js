import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts';
import '/imports/ui/components';
import '/imports/ui/pages';

import { Organizations } from '/imports/api/organizations/organizations.js';


FlowRouter.route('/', {
  name: 'home',
  action: function(params) {
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

FlowRouter.route('/organizations/:orgSerialNumber', {
  name: 'dashboardPage',
  action(params) {
    BlazeLayout.render('DashboardLayout', {
      content: 'DashboardPage'
    });
  }
});

FlowRouter.route('/organizations', {
  name: 'organizationPickerPage',
  action(params) {
    BlazeLayout.render('OrganizationPickerPage');
  }
});

function redirectHandler() {
  const organizationsCount = Organizations.find({'users.userId': Meteor.userId()}).count();
  if (organizationsCount > 1) {
    FlowRouter.go('organizationPickerPage')
  } else {
    const { serialNumber } = Organizations.findOne();
    FlowRouter.go('dashboardPage', { orgSerialNumber: serialNumber });
  }
};
