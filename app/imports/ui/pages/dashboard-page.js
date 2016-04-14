import { Organizations } from '/imports/api/organizations/organizations.js';

Template.DashboardPage.helpers({
  organization() {
    const _id = FlowRouter.getParam("_id");
    return Organizations.findOne(_id);
  }
});
