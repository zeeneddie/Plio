import { handleMethodResult } from '/imports/api/helpers.js';


Template.EditableModal.viewmodel({
  mixin: 'collapse',
  savingStateTimeout: 500,
  isSaving: false,
  error: '',
  closeButtonText() {
    return this.isSaving() ? 'Saving...' : 'Close';
  },
  callMethod(method, args, cb) {
    if (_.isFunction(args)) {
      cb = args;
      args = {};
    }

    this.clearError();
    this.isSaving(true);

    method.call(args, this.handleMethodResult(cb));
  },
  handleMethodResult(cb) {
    return (err, res) => {
      // if callback returns true, doesn't perform default actions
      if (_.isFunction(cb) && cb(err, res)) {
        return;
      }

      if (this.timeout) {
        Meteor.clearTimeout(this.timeout);
      }

      this.timeout = Meteor.setTimeout(() => {
        this.isSaving(false);

        if (err) {
          console.log(err);
          this.setError(err.reason);
        }
      }, this.savingStateTimeout());
    };
  },
  setError(errMessage) {
    this.error(errMessage);
    this.errorSection.collapse('show');
  },
  clearError() {
    this.error('');
    this.errorSection.collapse('hide');
  }
});
