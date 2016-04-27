import { handleMethodResult } from '/imports/api/helpers.js';


Template.EditableModal.viewmodel({
  savingStateTimeout: 1000,
  mixin: 'collapse',
  isSaving: false,
  closeButtonText() {
    return this.isSaving() ? 'Saving...' : 'Close';
  },
  callMethod(method, args, cb) {
    if (_.isFunction(args)) {
      cb = args;
      args = {};
    }

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
      }, this.savingStateTimeout());
    };
  },
});
