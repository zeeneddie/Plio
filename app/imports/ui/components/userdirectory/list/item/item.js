import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.UserDirectory_List_Item.viewmodel({
  mixin: ['user', 'organization'],
  linkArgs() {
    const _id = this._id();
    return {
      isActive: Object.is(FlowRouter.getParam('userId'), _id),
      onClick: handler => handler({ userId: _id }),
      href: (() => {
        const params = {
          userId: _id,
          orgSerialNumber: this.organizationSerialNumber(),
        };
        return FlowRouter.path('userDirectoryUserPage', params);
      })(),
    };
  },
});
