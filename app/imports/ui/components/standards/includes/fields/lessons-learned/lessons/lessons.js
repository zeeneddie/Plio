import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Random } from 'meteor/random';

Template.ESLessons.viewmodel({
  mixin: 'collapse',
  onRendered() {
    this.datepicker.datepicker();
  },
  date: '',
  save() {
    const data = this.getData();

    for (let prop in data) {
      if (!data[prop]) {
        ViewModel.findOne('ModalWindow').setError(`${prop} is required!`);
        return;
      }
    }

    const { title, date, owner } = this.getData();
    const options = {};

    if (this._id) {
      this.parent().insert({ title, date, owner });
    }

    if (this._id) {
      options['$set'] = { 'lessons.$': { title, date, owner } };
    } else {
      options['$addToSet'] = { lessons: { _id, title, date, owner } };
    }

    ViewModel.findOne('EditStandard').update({}, options, () => Blaze.remove(this.templateInstance.view));
  },
  delete() {
    const _id = this._id && this._id();
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    if (_id) {
      const options = {
        '$pull': {
          lessons: {
            _id: _id
          }
        }
      };
      ViewModel.findOne('EditStandard').update({}, options, () => Blaze.remove(this.templateInstance.view));
    } else {
      Blaze.remove(this.templateInstance.view);
    }
  },
  getData() {
    const { owner } = this.child('ESOwner').getData();
    const { title, date } = this.data();
    return { title, date, owner };
  }
});
