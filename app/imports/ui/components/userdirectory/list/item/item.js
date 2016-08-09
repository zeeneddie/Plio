import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.UserDirectory_List_Item.viewmodel({
  share: 'window',
  mixin: ['user', 'organization'],
  isActiveUser() {
    return FlowRouter.getParam('userId') === this._id();
  },
  getHref() {
    const params = { orgSerialNumber: this.organizationSerialNumber(), userId: this._id() };
    return FlowRouter.path('userDirectoryUserPage', params);
  },
  goToUser(e) {
    e.preventDefault();

    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ userId: this._id() });
  }
});
