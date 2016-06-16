import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.SubCardEdit.viewmodel({
  mixin: ['collapse', 'subcard', 'callWithFocusCheck'],
  onRendered() {
    if (!this._id) {
      this.toggleCollapse();
    }
  },
  _lText: '',
  _rText: '',
  content: '',
  save() {
    this.callSave(this.insertFn, this.getData(), (err) => {
      if (!err) {
        Meteor.setTimeout(() => this.destroy(), 500);
      }
    });
  },
  delete() {
    this.removeFn(this);
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  update(e, propName, withFocusCheck) {
    const _id = this._id && this._id();
    if (!_id) {
      return;
    }

    const propVal = this.getData()[propName];
    const savedVal = this.templateInstance.data[propName];
    if (propVal === savedVal) {
      return;
    }

    const updateFn = () => {
      this.callSave(this.updateFn, {
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
  getData() {
    return this.child(this.content()).getData();
  }
});
