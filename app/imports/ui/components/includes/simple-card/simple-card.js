import { Template } from 'meteor/templating';

Template.SimpleCard.viewmodel({
  mixin: 'organization',
  route: '',
  href() {
    return this.route() ? FlowRouter.path(this.route(), { orgSerialNumber: this.organization().serialNumber }) : '#';
  },
});
