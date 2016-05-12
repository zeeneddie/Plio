import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Random } from 'meteor/random';

Template.ESLessons.viewmodel({
  mixin: ['collapse', 'date'],
  autorun() {
    console.log(this.data());
  },
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
      ViewModel.findOne('ESLessonsLearned').update({ _id, title, date, createdBy, standardId, notes });
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
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    if (_id) {
      ViewModel.findOne('ESLessonsLearned').remove({ _id }, this.destroy());
    } else {
      this.destroy();
    }
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
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
