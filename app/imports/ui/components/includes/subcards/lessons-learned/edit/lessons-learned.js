import { Template } from 'meteor/templating';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { insert, update, remove } from '/imports/api/lessons/methods.js';

Template.Subcards_LessonsLearned_Edit.viewmodel({
  mixin: ['collapse', 'modal', 'addForm', 'organization'],
  documentId: '',
  documentType: '',
  renderText({ title, serialNumber }) {
    return `<strong>LL${serialNumber}</strong> ${title}`;
  },
  lessons() {
    const documentId = this.documentId();
    const query = { standardId: documentId };
    const options = { sort: { serialNumber: 1 } };
    return LessonsLearned.find(query, options);
  },
  insert({ ...args }, cb) {
    const organizationId = this.organizationId();
    this.modal().callMethod(insert, { organizationId, documentId, documentType, ...args }, cb);
  },
  update({ ...args }, cb) {
    this.modal().callMethod(update, { ...args }, cb);
  },
  remove({ _id }, cb) {
    this.modal().callMethod(remove, { _id }, cb);
  }
});
