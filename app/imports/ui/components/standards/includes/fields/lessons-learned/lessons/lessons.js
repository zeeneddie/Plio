import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Random } from 'meteor/random';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { Standards } from '/imports/api/standards/standards.js';

Template.ESLessons.viewmodel({
  mixin: ['collapse', 'subcard', 'date', 'callWithFocusCheck', { standard: 'standard' }],
  title: '',
  date: '',
  owner: '',
  onCreated() {
    if (!this.owner()) {
      this.owner(Meteor.userId());
    }

    if (!this.date()) {
      this.date(new Date());
    }
  },
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

    const updateFn = () => {
      this.callSave(parent.update.bind(parent), {
        _id,
        [propName]: propVal
      });
    };

    if (withFocusCheck) {
      this.isWaiting(true);
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
    const standardId = this.standard.standardId();

    const parent = ViewModel.findOne('ESLessonsLearned');

    this.callSave(parent.insert.bind(parent), {
      title, date, owner, standardId, notes
    }, (err) => {
      if (!err) {
        Meteor.setTimeout(() => this.destroy(), 500);
      }
    });
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
  getData() {
    return {
      title: this.title(),
      owner: this.owner(),
      date: this.date(),
      notes: this.child('QuillEditor').editor().getHTML()
    };
  }
});
