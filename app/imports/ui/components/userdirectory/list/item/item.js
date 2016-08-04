import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.UserDirectory_List_Item.viewmodel({
  share: 'window',
  mixin: 'user',
  isActiveUser() {
    return FlowRouter.getParam('userId') === this._id();
  },
  goToUser(e) {
    e.preventDefault();

    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ userId: this._id() });
  }
});
