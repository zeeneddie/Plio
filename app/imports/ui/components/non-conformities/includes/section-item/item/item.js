import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.NCItem.viewmodel({
  navigate() {
    FlowRouter.setParams({ riskId: this._id() });
  }
});
