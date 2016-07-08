import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';


Template.Actions_AddSubcard.viewmodel({
  form: 'Actions_CreateSubcard',
  formData: '',
  getFormData() {
    const linkedTo = this.linkedTo && this.linkedTo();
    const documentId = this.documentId && this.documentId();
    const documentType = this.documentType && this.documentType();

    const defaultData = {
      type: this.type()
    };

    if (linkedTo) {
      _.extend(defaultData, { linkedTo });
    }

    if (documentId && documentType) {
      _.extend(defaultData, { documentId, documentType });
    }

    return _.extend({}, defaultData, this.formData());
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
