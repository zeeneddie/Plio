import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts';
import '../../ui/components';


FlowRouter.route('/', {
  name: 'dashboard',
  action: function(params) {
    BlazeLayout.render('DashboardLayout');
  }
});
