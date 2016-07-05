import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';


Template.Actions_AddSubcard.viewmodel({
  form: 'Actions_CreateSubcard',
  formData: '',
  getFormData() {
    return _.extend({}, {
      type: this.type(),
      linkedStandardsIds: this.linkedStandardsIds(),
      documentId: this.documentId(),
      documentType: this.documentType()
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
