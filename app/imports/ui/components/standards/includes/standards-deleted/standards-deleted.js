import { Template } from 'meteor/templating';

Template.StandardsDeletedList.viewmodel({
  share: 'standard',
  mixin: ['standard', 'organization'],
  autorun() {
    if (!this.standardId() && this.items().count() > 0 && this.organizationSerialNumber()) {
      const standard = this.items().fetch()[0];
      if (standard) {
        console.log(standard);
        FlowRouter.go('standard', { orgSerialNumber: this.organizationSerialNumber(), standardId: standard._id }, { by: this.activeStandardFilter() });
      }
    }
  }
});
