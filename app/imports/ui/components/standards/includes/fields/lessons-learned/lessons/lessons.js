import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Random } from 'meteor/random';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { Standards } from '/imports/api/standards/standards.js';

Template.ESLessons.viewmodel({
  mixin: ['collapse', 'date', 'callWithFocusCheck', { standard: 'standard' }],
  title: '',
  date: '',
  owner: '',
  onRendered() {
    if (!this._id) {
     this.toggleCollapse();
    }
  },
  events: {
    'focusout .editor-container'(e, tpl) {
      this.updateNotes(e);
    }
  },
  linkedStandard() {
    const _id = this.standardId ? this.standardId() : this.standard.standardId();
    const standard = Standards.findOne({ _id });
    return !!standard ? standard.title : '';
  },
  renderSerialNumber() {
    return !!(this._id && this._id() && this.serialNumber && this.serialNumber()) ? `LL ${this.serialNumber()}` : '';
  },
  update(e, propName, withFocusCheck) {
    const _id = this._id && this._id();
    if (!_id) {
      return;
    }

    const propVal = this.getData()[propName];
    const parent = ViewModel.findOne('ESLessonsLearned');

    let updateFn = () => {
      parent.update({
        _id,
        [propName]: propVal
      });
    };

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
  updateTitle(e) {
    this.update(e, 'title', true);
  },
  onDateChangeCb() {
    return this.updateDate.bind(this);
  },
  updateDate(viewModel) {
    const { date } = viewModel.getData();
    this.date(date);
    this.update(null, 'date');
  },
  onOwnerChangedCb() {
    return this.updateOwner.bind(this);
  },
  updateOwner(viewModel) {
    const { owner } = viewModel.getData();
    this.owner(owner);
    this.update(null, 'owner');
  },
  updateNotes(e) {
    this.update(e, 'notes', true);
  },
  save() {
    const { title, date, owner, notes } = this.getData();
    const _id = this._id && this._id();
    const standardId = this.standard.standardId();

    if (_id) {
      ViewModel.findOne('ESLessonsLearned').update({
        _id, title, date, owner, standardId, notes
      }, () => this.toggleCollapse());
    } else {
      ViewModel.findOne('ESLessonsLearned').insert({
        title, date, owner, standardId, notes
      }, (err, _id) => {
        if (!err) {
          this.destroy();
          const sectionToCollapse = ViewModel.findOne(
            'ESLessons', vm => vm._id && vm._id() === _id
          );
          !!sectionToCollapse && sectionToCollapse.toggleCollapse();
        }
      });
    }
  },
  delete() {
    const _id = this._id && this._id();
    const { title } = this.getData();

    if (_id) {
      swal({
        title: 'Are you sure?',
        text: `The lesson "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      }, () => {
        ViewModel.findOne('ESLessonsLearned').remove({ _id }, () => {
          this.destroy(() => swal(
            'Removed!', `The lesson "${title}" was removed successfully.`, 'success'
          ));
        });
      });
    } else {
      this.destroy();
    }
  },
  destroy(cb) {
    Blaze.remove(this.templateInstance.view);

    if (cb) cb();
  },
  getDate() {
    return this.date() && this._id ? this.date() : '';
  },
  getData() {
    return {
      title: this.title(),
      owner: this.owner(),
      date: this.date(),
      notes: this.child('QuillEditor').editor().getHTML()
    };
  }
});
