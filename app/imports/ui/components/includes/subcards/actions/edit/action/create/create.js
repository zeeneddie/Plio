import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';


Template.Actions_CreateSubcard.viewmodel({
  form: 'Actions_Create',
  formData: '',
  getFormData() {
    return _.extend({}, {
      type: this.type(),
      linkedDocs: this.linkedDocs()
    }, this.formData());
  },
  selectForm(formName) {
    this.formData('');
    this.form(formName);
  },
  showForm(formName, formData) {
    this.form(formName);
    this.formData(formData);
  },
  getData() {
    const form = this.child(this.form());
    return form && form.getData();
  }
});
