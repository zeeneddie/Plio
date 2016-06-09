import { Template } from 'meteor/templating';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { insert, update, remove } from '/imports/api/lessons/methods.js';

Template.Subcards_LessonsLearned_Edit.viewmodel({
  mixin: ['collapse', 'modal', 'addForm', 'organization'],
  documentId: '',
  documentType: '',
  linkedTo: '',
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
      'SubCardEdit',
      {
        content: 'Subcards_LessonLearned',
        onSave: this.save.bind(this),
        onDelete: this.remove.bind(this)
      }
    );
  },
  insert(viewmodel, { ...args }) {
    const organizationId = this.organizationId();
    const { documentId, documentType } = this.data();
    const cb = () => viewmodel.destroy();

    this.modal().callMethod(insert, { organizationId, documentId, documentType, ...args }, cb);
  },
  update(viewmodel, { _id, title, date, owner, notes }) {
    const context = viewmodel.templateInstance.data;
    const cb = () => viewmodel.toggleCollapse();


    if (context['title'] === title &&
        context['date']  === date  &&
        context['owner'] === owner &&
        context['notes'] === notes) return;

    this.modal().callMethod(update, { _id, title, date, owner, notes }, cb);
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
  onSaveCb() {
    return this.save.bind(this);
  },
  save(viewmodel) {
    const _id = viewmodel._id && viewmodel._id();

    const { title, date, owner, notes } = viewmodel.getData();

    if (!_id) {
      this.insert(viewmodel, { title, date, owner, notes });
    } else {
      this.update(viewmodel, { _id, title, date, owner, notes });
    }
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
});
