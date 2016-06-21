import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

Template.SubCardEdit.viewmodel({
  mixin: ['collapse', 'callWithFocusCheck', 'modal'],
  isSubcard: true,
  isSaving: false,
  isWaiting: false,
  closeAfterCall: false,
  error: '',
  onRendered() {
    if (!this._id) {
      this.toggleCollapse();
    }
  },
  _lText: '',
  _rText: '',
  content: '',
  callSave(saveFn, args, cb) {
    this.isWaiting(false);
    this.isSaving(true);
    this.clearError();

    saveFn(args, (err, res) => {
      if (err) {
        err.isFromSubcard = true;
      }

      Meteor.setTimeout(() => {
        this.isSaving(false);
        if (err) {
          this.setError(err.reason);
          err.isSubcardError = true;
          const currentSubcard = this.subcard;
          currentSubcard.closest('.modal').animate({ scrollTop: currentSubcard.position().top + 70 }, 500, 'swing');
        } else if (this.closeAfterCall()) {
          this.toggleCollapse();
        }

        this.closeAfterCall(false);
      }, 500);

      if (_.isFunction(cb)) {
        return cb(err, res);
      }
    });
  },
  close() {
    const _id = this._id && this._id();

    if (_id) {
      if (this.isWaiting.value || this.isSaving.value) {
        this.closeAfterCall(true);
      } else {
        this.toggleCollapse();
      }
    } else {
      this.save && this.save();
    }
  },
  setError(errMsg) {
    const setError = () => {
      this.error(errMsg);
      this.errorSection.collapse('show');
    };

    if (!this.collapse.hasClass('in')) {
      this.collapse.collapse('show');

      this.collapse.on('shown.bs.collapse', () => {
        setError();
      });
    } else {
      setError();
    }
  },
  clearError() {
    this.error('');
    this.errorSection.collapse('hide');
  },
  hasError() {
    return !!this.error();
  },
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

    // Disgusting...
    if (_.isObject(e) && _.keys(e).length > 0 && !( e instanceof jQuery.Event )) {
      this.parent().update({ ...e, _id }, propName);
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
