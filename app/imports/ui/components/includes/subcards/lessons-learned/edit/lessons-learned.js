import { Template } from 'meteor/templating';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { insert, update, remove } from '/imports/api/lessons/methods.js';

Template.Subcards_LessonsLearned_Edit.viewmodel({
  mixin: ['collapse', 'modal', 'addForm', 'organization'],
  documentId: '',
  documentType: '',
  linkedTo: '',
  linkedToId: '',
  renderText({ title, serialNumber }) {
    return `<strong>LL${serialNumber}</strong> ${title}`;
  },
  lessons() {
    const documentId = this.documentId();
    const query = { documentId };
    const options = { sort: { serialNumber: 1 } };
    return LessonsLearned.find(query, options);
  },
  addLesson() {
    this.addForm(
      'Subcard',
      {
        content: 'Subcards_LessonLearned',
        _lText: 'New lessons learned',
        linkedTo: this.linkedTo(),
        linkedToId: this.linkedToId(),
        insertFn: this.insertFn(),
        removeFn: this.removeFn(),
        updateFn: this.updateFn()
      }
    );
  },
  insertFn() {
    return this.insert.bind(this);
  },
  insert({ ...args }, cb) {
    const organizationId = this.organizationId();
    const { documentId, documentType } = this.data();

    this.modal().callMethod(insert, {
      organizationId, documentId, documentType, ...args
    }, cb);
  },
  updateFn() {
    return this.update.bind(this);
  },
  update({ ...args }, cb) {
    this.modal().callMethod(update, { ...args }, cb);
  },
  remove(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    const { title } = viewmodel.getData();

    if (!_id) {
      return viewmodel.destroy();
    } else {
      swal(
        {
          title: 'Are you sure?',
          text: `The lesson "${title}" will be removed.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Remove',
          closeOnConfirm: false
        },
        () => {
          const cb = () => {
            viewmodel.destroy();
            swal('Removed!', `The lesson "${title}" was removed successfully.`, 'success');
          };

          this.modal().callMethod(remove, { _id }, cb);
        }
      );
    }
  },
  removeFn() {
    return this.remove.bind(this);
  },
});
