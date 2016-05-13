import { Template } from 'meteor/templating';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { insert, update, remove } from '/imports/api/lessons/methods.js';

Template.ESLessonsLearned.viewmodel({
  mixin: ['collapse', 'modal', 'addForm'],
  lessons() {
    return LessonsLearned.find({}, { sort: { serialNumber: 1 } });
  },
  insert(args, cb) {
    this.modal().callMethod(insert, args, cb);
  },
  update(args, cb) {
    this.modal().callMethod(update, args, cb);
  },
  remove({ _id }, cb) {
    this.modal().callMethod(remove, { _id }, cb);
  }
});
