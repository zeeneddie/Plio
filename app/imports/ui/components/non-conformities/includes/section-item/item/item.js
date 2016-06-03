import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.NCItem.viewmodel({
  share: 'window',
  mixin: ['date', 'nonconformity'],
  navigate() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ nonconformityId: this._id() });
  }
});
