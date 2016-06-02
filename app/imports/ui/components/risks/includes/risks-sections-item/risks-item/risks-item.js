import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.RisksItem.viewmodel({
  navigate() {
    FlowRouter.setParams({ riskId: this._id() });
  }
});
