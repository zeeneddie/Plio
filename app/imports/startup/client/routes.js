import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts';
import '/imports/ui/components';
import '/imports/ui/pages';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { update } from '/imports/api/users/methods.js';


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

FlowRouter.route('/hello', {
  name: 'hello',
  action(params) {
    BlazeLayout.render('HelloPage');
  }
});

FlowRouter.route('/:orgSerialNumber', {
  name: 'dashboardPage',
  action(params) {
    // const selectedOrganizationSerialNumber = params.orgSerialNumber;
    // update.call({
    //   selectedOrganizationSerialNumber
    // });
    BlazeLayout.render('DashboardLayout', {
      content: 'DashboardPage'
    });
  }
});
