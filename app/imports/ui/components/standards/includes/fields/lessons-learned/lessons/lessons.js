import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Random } from 'meteor/random';

Template.ESLessons.viewmodel({
  mixin: ['collapse', 'date'],
  onRendered() {
    if (!this._id) {
      this.toggleCollapse();
    }
  },
  standard() {
    return ViewModel.findOne('ESLessonsLearned').standard();
  },
  renderSerialNumber() {
    return !!(this._id && this._id() && this.serialNumber && this.serialNumber()) ? `LL ${this.serialNumber()}` : ''
  },
  title: '',
  date: '',
  save() {
    const data = this.getData();
    const _id = this._id && this._id();

    for (let prop in data) {
      if (!data[prop]) {
        ViewModel.findOne('ModalWindow').setError(`${prop} is required!`);
        return;
      }
    }

    const { title, date, createdBy, notes } = this.getData();
    const standardId = this.standard() && this.standard()._id;

    if (_id) {
      ViewModel.findOne('ESLessonsLearned').update({ _id, title, date, createdBy, standardId, notes }, () => this.toggleCollapse());
    } else {
      ViewModel.findOne('ESLessonsLearned').insert({ title, date, createdBy, standardId, notes }, (err, _id) => {
        this.destroy();
        const sectionToCollapse = ViewModel.findOne('ESLessons', vm => vm._id && vm._id() === _id);
        !!sectionToCollapse && sectionToCollapse.toggleCollapse();
      });
    }
  },
  delete() {
    const _id = this._id && this._id();
    const { title } = this.getData();

    if (_id) {
      swal(
        {
          title: 'Are you sure?',
          text: `The lesson "${title}" will be removed.`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonClass: 'btn-danger',
          confirmButtonText: 'Remove',
          closeOnConfirm: false
        },
        () => {
          ViewModel.findOne('ESLessonsLearned').remove({ _id }, this.destroy(() =>
            swal('Removed!', `The lesson "${title}" was removed succesfully.`, 'success')));
        }
      );
    } else {
      this.destroy();
    }
  },
  destroy(cb) {
    Blaze.remove(this.templateInstance.view);

    if (cb) cb();
  },
  getDate() {
    return this.date() && this._id ? this.renderDate(this.date()) : '';
  },
  getData() {
    const { owner:createdBy } = this.child('ESOwner').getData();
    const { date } = this.child('Datepicker').getData();
    const notes = this.child('QuillEditor').editor().getHTML();
    const { title } = this.data();
    return { title, date, createdBy, notes };
  }
});
