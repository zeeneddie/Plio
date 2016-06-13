import { Template } from 'meteor/templating';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { insert, update, remove } from '/imports/api/lessons/methods.js';

Template.ESLessonsLearned.viewmodel({
  mixin: ['collapse', 'modal', 'addForm', 'organization', 'standard'],
  lessons() {
    const standardId = this.standardId();
    const query = { standardId };
    const options = { sort: { serialNumber: 1 } };
    return LessonsLearned.find(query, options);
  },
  insert({ ...args }, cb) {
    const organizationId = this.organizationId();
    this.modal().callMethod(insert, { organizationId, ...args }, cb);
  },
  update({ ...args }, cb) {
    this.modal().callMethod(update, { ...args }, cb);
  },
  remove({ _id }, cb) {
    this.modal().callMethod(remove, { _id }, cb);
  }
});
