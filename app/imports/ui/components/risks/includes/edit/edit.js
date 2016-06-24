import { Template } from 'meteor/templating';

Template.EditRisk.viewmodel({
  mixin: ['risk', 'organization'],
  risk() {
    return this._getRiskByQuery({ _id: this._id() });
  },
  update(...args) {
    return this.parent().update(...args);
  }
});
