import { Template } from 'meteor/templating';

import { DashboardPageContainer } from '../../react/dashboard/containers';

Template.Dashboard_Page.viewmodel({
  mixin: ['organization'],
  DashboardPageContainer: () => DashboardPageContainer,
});
