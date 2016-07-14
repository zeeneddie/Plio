import { Template } from 'meteor/templating';

Template.SS_Card_Modal.viewmodel({
  mixin: ['organization', 'nonconformity', 'modal']
});
